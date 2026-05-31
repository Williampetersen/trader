import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getPlanConfig, planCatalog, type PlanName } from "@/data/plans";

export type { PlanName } from "@/data/plans";
export type EntryType = "Buy" | "Sell" | "Watch";
export type Outcome = "Won" | "Lost" | "Not Taken" | "Not set";

export interface UserRecord {
    id: string;
    name: string;
    email: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    lastSeenAt?: string;
    profile: {
        mobile: string;
        country: string;
        gender: string;
        ageGroup: string;
    };
    plan: {
        name: PlanName;
        dailyLimit: number;
        creditsLeft: number;
        expiresAt: string;
        autoRenewal: boolean;
        lastCreditResetAt?: string;
    };
    settings?: {
        twoFactorEnabled: boolean;
        loginNotifications: boolean;
    };
}

export interface SessionRecord {
    id: string;
    userId: string;
    expiresAt: string;
}

export interface OwnerSessionRecord {
    id: string;
    email: string;
    expiresAt: string;
}

export interface AnalysisRecord {
    id: string;
    userId: string;
    symbol: string;
    timeframe: string;
    summary: string;
    entryType: EntryType;
    confidence: number;
    riskReward: number;
    outcome: Outcome;
    support: string;
    resistance: string;
    stopLoss: string;
    entry: string;
    tp1: string;
    tp2: string;
    fileName: string;
    imagePath?: string;
    imageMime?: string;
    createdAt: string;
}

export interface ChatMessageRecord {
    id: string;
    userId: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

export interface PaymentRecord {
    id: string;
    userId: string;
    date: string;
    plan: string;
    amount: number;
    start: string;
    end: string;
}

export interface SupportTicketRecord {
    id: string;
    userId: string;
    subject: string;
    message: string;
    status: "Open" | "Answered";
    createdAt: string;
}

export interface NewsletterLeadRecord {
    id: string;
    email: string;
    name: string;
    source: string;
    createdAt: string;
}

export interface AuthOtpRecord {
    id: string;
    email: string;
    codeHash: string;
    codeSalt: string;
    attempts: number;
    createdAt: string;
    expiresAt: string;
    resendAfter: string;
}

interface AppDb {
    users: UserRecord[];
    sessions: SessionRecord[];
    ownerSessions?: OwnerSessionRecord[];
    analyses: AnalysisRecord[];
    chats: ChatMessageRecord[];
    payments: PaymentRecord[];
    supportTickets?: SupportTicketRecord[];
    newsletterLeads?: NewsletterLeadRecord[];
    authOtps?: AuthOtpRecord[];
}

const dataRoot = process.env.GCV_DATA_DIR || (process.env.VERCEL ? path.join("/tmp", "gpt-chart-view") : path.join(process.cwd(), ".local", "gpt-chart-view"));
const dbPath = path.join(dataRoot, "db.json");
let memoryDb: AppDb | null = null;
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redisDbKey = process.env.GCV_DB_KEY || "gpt-chart-view:db";

const hasRemoteStore = Boolean(redisUrl && redisToken);

const emptyDb = (): AppDb => ({
    users: [],
    sessions: [],
    ownerSessions: [],
    analyses: [],
    chats: [],
    payments: [],
    supportTickets: [],
    newsletterLeads: [],
    authOtps: [],
});

export const newId = () => randomBytes(16).toString("hex");

export const defaultProfile = () => ({ mobile: "", country: "", gender: "", ageGroup: "" });

const legacyPlanMap: Record<string, PlanName> = {
    Starter: "Basic Access",
    "Active Traders": "Pro Trader",
};

export function normalizeUser(user: UserRecord) {
    user.profile ||= defaultProfile();
    user.settings ||= { twoFactorEnabled: false, loginNotifications: true };
    return user;
}

const dateKey = (date: Date) => date.toISOString().slice(0, 10);

export function createPlan(planName: PlanName, now = new Date(), options?: { autoRenewal?: boolean; expiresAt?: string }) {
    const config = getPlanConfig(planName);
    return {
        name: planName,
        dailyLimit: config.dailyLimit,
        creditsLeft: config.dailyLimit,
        expiresAt: options?.expiresAt || new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000).toISOString(),
        autoRenewal: Boolean(options?.autoRenewal),
        lastCreditResetAt: now.toISOString(),
    };
}

export function isPlanExpired(user: UserRecord, now = new Date()) {
    return new Date(user.plan.expiresAt).getTime() <= now.getTime();
}

export function applyPlanRules(user: UserRecord, now = new Date()) {
    normalizeUser(user);
    let changed = false;

    const planName = String(user.plan.name);
    if (legacyPlanMap[planName]) {
        user.plan.name = legacyPlanMap[planName];
        changed = true;
    } else if (!planCatalog[user.plan.name]) {
        user.plan.name = "Trial";
        changed = true;
    }

    const config = getPlanConfig(user.plan.name);
    if (user.plan.dailyLimit !== config.dailyLimit) {
        user.plan.dailyLimit = config.dailyLimit;
        changed = true;
    }

    if (typeof user.plan.creditsLeft !== "number" || Number.isNaN(user.plan.creditsLeft)) {
        user.plan.creditsLeft = config.dailyLimit;
        changed = true;
    }

    if (typeof user.plan.autoRenewal !== "boolean") {
        user.plan.autoRenewal = false;
        changed = true;
    }

    if (!user.plan.expiresAt) {
        user.plan.expiresAt = new Date(now.getTime() + config.durationDays * 24 * 60 * 60 * 1000).toISOString();
        changed = true;
    }

    if (isPlanExpired(user, now)) {
        if (user.plan.creditsLeft !== 0) {
            user.plan.creditsLeft = 0;
            changed = true;
        }
        return changed;
    }

    if (config.creditReset === "none") {
        if (!user.plan.lastCreditResetAt) {
            user.plan.lastCreditResetAt = now.toISOString();
            changed = true;
        }
        if (user.plan.creditsLeft > user.plan.dailyLimit) {
            user.plan.creditsLeft = user.plan.dailyLimit;
            changed = true;
        }
        if (user.plan.creditsLeft <= 0) {
            if (user.plan.creditsLeft !== 0) {
                user.plan.creditsLeft = 0;
                changed = true;
            }
            if (new Date(user.plan.expiresAt).getTime() > now.getTime()) {
                user.plan.expiresAt = now.toISOString();
                changed = true;
            }
        }
        return changed;
    }

    if (!user.plan.lastCreditResetAt) {
        user.plan.lastCreditResetAt = now.toISOString();
        changed = true;
    } else if (dateKey(new Date(user.plan.lastCreditResetAt)) !== dateKey(now)) {
        user.plan.creditsLeft = user.plan.dailyLimit;
        user.plan.lastCreditResetAt = now.toISOString();
        changed = true;
    }

    if (user.plan.creditsLeft > user.plan.dailyLimit) {
        user.plan.creditsLeft = user.plan.dailyLimit;
        changed = true;
    }

    if (user.plan.creditsLeft < 0) {
        user.plan.creditsLeft = 0;
        changed = true;
    }

    return changed;
}

export async function readDb(): Promise<AppDb> {
    if (hasRemoteStore) {
        try {
            const remoteDb = await readRemoteDb();
            if (remoteDb) {
                memoryDb = remoteDb;
                return remoteDb;
            }

            const db = emptyDb();
            await writeDb(db);
            return db;
        } catch (error) {
            console.error("Remote database read failed", error);
        }
    }

    if (memoryDb) return memoryDb;

    try {
        const raw = await readFile(dbPath, "utf8");
        memoryDb = JSON.parse(raw) as AppDb;
        return memoryDb;
    } catch {
        const db = emptyDb();
        await writeDb(db);
        return db;
    }
}

export async function writeDb(db: AppDb) {
    db.supportTickets ||= [];
    db.ownerSessions ||= [];
    db.newsletterLeads ||= [];
    db.authOtps ||= [];
    memoryDb = db;
    if (hasRemoteStore) {
        try {
            await writeRemoteDb(db);
            return;
        } catch (error) {
            console.error("Remote database write failed", error);
        }
    }
    await mkdir(path.dirname(dbPath), { recursive: true });
    await writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
}

async function readRemoteDb() {
    const response = await fetch(redisUrl!, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${redisToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(["GET", redisDbKey]),
        cache: "no-store",
    });

    if (!response.ok) throw new Error(`Redis GET failed with ${response.status}`);

    const payload = await response.json() as { result?: string | null };
    if (!payload.result) return null;
    return JSON.parse(payload.result) as AppDb;
}

async function writeRemoteDb(db: AppDb) {
    const response = await fetch(redisUrl!, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${redisToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(["SET", redisDbKey, JSON.stringify(db)]),
        cache: "no-store",
    });

    if (!response.ok) throw new Error(`Redis SET failed with ${response.status}`);
}

export function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string) {
    const attempted = Buffer.from(scryptSync(password, salt, 64).toString("hex"), "hex");
    const stored = Buffer.from(hash, "hex");
    return stored.length === attempted.length && timingSafeEqual(stored, attempted);
}

export function publicUser(user: UserRecord) {
    const normalizedUser = normalizeUser(user);
    return {
        id: normalizedUser.id,
        name: normalizedUser.name,
        email: normalizedUser.email,
        createdAt: normalizedUser.createdAt,
        profile: normalizedUser.profile,
        plan: normalizedUser.plan,
        settings: normalizedUser.settings,
    };
}

export function planDetails(planName: PlanName) {
    const config = getPlanConfig(planName);
    return { days: config.durationDays, dailyLimit: config.dailyLimit, amount: config.price };
}

export function buildAnalysis(userId: string, fileName: string, symbol = "EUR/USD", timeframe = "1h"): AnalysisRecord {
    const now = new Date();
    const seed = Array.from(`${fileName}${symbol}${timeframe}`).reduce((total, char) => total + char.charCodeAt(0), 0);
    const confidence = 62 + (seed % 28);
    const entryType: EntryType = seed % 3 === 0 ? "Buy" : seed % 3 === 1 ? "Sell" : "Watch";
    const base = 1.15 + (seed % 200) / 10000;
    const entry = base.toFixed(5);
    const support = (base - 0.009).toFixed(5);
    const resistance = (base + 0.007).toFixed(5);
    const stopLoss = (entryType === "Buy" ? base - 0.004 : base + 0.004).toFixed(5);
    const tp1 = (entryType === "Buy" ? base + 0.006 : base - 0.006).toFixed(5);
    const tp2 = (entryType === "Buy" ? base + 0.011 : base - 0.011).toFixed(5);
    const bias = entryType === "Buy" ? "Bullish continuation" : entryType === "Sell" ? "Bearish continuation" : "Mixed structure";

    return {
        id: newId(),
        userId,
        symbol: symbol.trim() || "EUR/USD",
        timeframe: timeframe.trim() || "1h",
        summary: `${bias} with visible key-level reaction and ${confidence}% setup confidence.`,
        entryType,
        confidence,
        riskReward: Number((1.4 + (seed % 140) / 100).toFixed(2)),
        outcome: "Not set",
        support,
        resistance,
        stopLoss,
        entry,
        tp1,
        tp2,
        fileName,
        createdAt: now.toISOString(),
    };
}
