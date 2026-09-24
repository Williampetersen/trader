import { planCatalog, type PlanName } from "@/data/plans";
import { AnalysisRecord, applyPlanRules, isPlanExpired, PaymentRecord, readDb, SupportTicketRecord, UserRecord, writeDb } from "./store";

const onlineWindowMs = 15 * 60 * 1000;
const dayMs = 24 * 60 * 60 * 1000;

export async function getOwnerMetrics() {
    const db = await readDb();
    const syncNow = new Date();
    let plansChanged = false;
    for (const user of db.users) {
        plansChanged = applyPlanRules(user, db.analyses, syncNow) || plansChanged;
    }
    if (plansChanged) await writeDb(db);
    const now = Date.now();
    const users = db.users;
    const analyses = db.analyses;
    const chats = db.chats;
    const payments = db.payments;
    const supportTickets = db.supportTickets || [];
    const activeSessions = (db.sessions || []).filter((session) => new Date(session.expiresAt).getTime() > now);

    const rows = users
        .map((user) => buildUserRow(user, analyses, payments, supportTickets, now))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const paidUsers = rows.filter((user) => user.planName !== "Trial" && !user.expired).length;
    const expiredUsers = rows.filter((user) => user.expired).length;
    const onlineUsers = rows.filter((user) => user.online).length;
    const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const monthRevenue = payments
        .filter((payment) => sameMonth(new Date(payment.date), new Date()))
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const mrr = rows
        .filter((user) => user.planName !== "Trial" && !user.expired)
        .reduce((sum, user) => sum + monthlyValue(user.planName), 0);

    return {
        generatedAt: new Date().toISOString(),
        summary: {
            totalUsers: users.length,
            onlineUsers,
            activeSessions: activeSessions.length,
            paidUsers,
            trialUsers: rows.filter((user) => user.planName === "Trial").length,
            expiredUsers,
            totalUploads: analyses.length,
            uploadsToday: analyses.filter((analysis) => isToday(new Date(analysis.createdAt))).length,
            aiMessages: chats.filter((chat) => chat.role === "assistant").length,
            openTickets: supportTickets.filter((ticket) => ticket.status === "Open").length,
            totalRevenue,
            monthRevenue,
            mrr,
        },
        userRows: rows,
        planBreakdown: countBy(rows, (row) => row.planName),
        countryBreakdown: countBy(rows, (row) => row.country || "Unknown"),
        signupTrend: lastDays(7).map((date) => ({
            label: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
            count: users.filter((user) => sameDay(new Date(user.createdAt), date)).length,
        })),
        uploadTrend: lastDays(7).map((date) => ({
            label: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
            count: analyses.filter((analysis) => sameDay(new Date(analysis.createdAt), date)).length,
        })),
        recentUsers: rows.slice(0, 8),
        recentAnalyses: analyses
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10)
            .map((analysis) => enrichAnalysis(analysis, users)),
        recentPayments: payments
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map((payment) => enrichPayment(payment, users)),
        paymentRows: payments
            .slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((payment) => enrichPayment(payment, users)),
        analysisRows: analyses
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((analysis) => enrichAnalysis(analysis, users)),
        supportTickets: supportTickets
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((ticket) => enrichTicket(ticket, users)),
    };
}

function buildUserRow(user: UserRecord, analyses: AnalysisRecord[], payments: PaymentRecord[], tickets: SupportTicketRecord[], now: number) {
    const userAnalyses = analyses.filter((analysis) => analysis.userId === user.id);
    const userPayments = payments.filter((payment) => payment.userId === user.id);
    const userTickets = tickets.filter((ticket) => ticket.userId === user.id);
    const lastUpload = userAnalyses
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    const lastPayment = userPayments
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const lastSeenTime = user.lastSeenAt ? new Date(user.lastSeenAt).getTime() : 0;

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.profile?.country || "Unknown",
        mobile: user.profile?.mobile || "",
        gender: user.profile?.gender || "",
        ageGroup: user.profile?.ageGroup || "",
        planName: user.plan.name,
        creditsLeft: user.plan.creditsLeft,
        dailyLimit: user.plan.dailyLimit,
        expiresAt: user.plan.expiresAt,
        autoRenewal: user.plan.autoRenewal,
        expired: isPlanExpired(user, new Date(now)),
        online: Boolean(lastSeenTime && now - lastSeenTime <= onlineWindowMs),
        lastSeenAt: user.lastSeenAt || "",
        createdAt: user.createdAt,
        uploads: userAnalyses.length,
        aiScoreAvg: userAnalyses.length ? Math.round(userAnalyses.reduce((sum, item) => sum + item.confidence, 0) / userAnalyses.length) : 0,
        payments: userPayments.length,
        revenue: userPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
        lastUploadAt: lastUpload?.createdAt || "",
        lastPaymentAt: lastPayment?.date || "",
        openTickets: userTickets.filter((ticket) => ticket.status === "Open").length,
        stripeCustomerId: user.stripeCustomerId || "",
        stripeSubscriptionId: user.stripeSubscriptionId || "",
    };
}

function enrichAnalysis(analysis: AnalysisRecord, users: UserRecord[]) {
    const user = users.find((item) => item.id === analysis.userId);
    return {
        id: analysis.id,
        userName: user?.name || "Deleted user",
        userEmail: user?.email || "",
        symbol: analysis.symbol,
        timeframe: analysis.timeframe,
        entryType: analysis.entryType,
        confidence: analysis.confidence,
        outcome: analysis.outcome,
        createdAt: analysis.createdAt,
    };
}

function enrichPayment(payment: PaymentRecord, users: UserRecord[]) {
    const user = users.find((item) => item.id === payment.userId);
    return {
        id: payment.id,
        userName: user?.name || "Deleted user",
        userEmail: user?.email || "",
        plan: payment.plan,
        amount: payment.amount,
        date: payment.date,
        end: payment.end,
    };
}

function enrichTicket(ticket: SupportTicketRecord, users: UserRecord[]) {
    const user = users.find((item) => item.id === ticket.userId);
    return {
        id: ticket.id,
        userName: user?.name || "Deleted user",
        userEmail: user?.email || "",
        subject: ticket.subject,
        message: ticket.message,
        status: ticket.status,
        createdAt: ticket.createdAt,
    };
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
    const counts = new Map<string, number>();
    items.forEach((item) => {
        const key = getKey(item);
        counts.set(key, (counts.get(key) || 0) + 1);
    });
    return Array.from(counts.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);
}

function lastDays(count: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: count }, (_, index) => new Date(today.getTime() - (count - index - 1) * dayMs));
}

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function sameMonth(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isToday(date: Date) {
    return sameDay(date, new Date());
}

function monthlyValue(planName: string) {
    const plan = planCatalog[planName as PlanName];
    if (!plan || planName === "Trial") return 0;
    return plan.billingInterval === "week" ? plan.price * 4 : plan.price;
}
