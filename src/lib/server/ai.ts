import { AnalysisRecord } from "./store";

interface AiChartResult {
    summary?: string;
    entryType?: "Buy" | "Sell" | "Watch";
    confidence?: number;
    riskReward?: number;
    support?: string;
    resistance?: string;
    stopLoss?: string;
    entry?: string;
    tp1?: string;
    tp2?: string;
}

export class AiAnalysisError extends Error {
    constructor(message: string, public readonly status = 503) {
        super(message);
        this.name = "AiAnalysisError";
    }
}

export async function enrichAnalysisWithAi(analysis: AnalysisRecord, image: File): Promise<AnalysisRecord> {
    if (!process.env.OPENAI_API_KEY) {
        throw new AiAnalysisError("Real AI chart analysis is not configured. Add OPENAI_API_KEY on the server and try again.", 503);
    }

    try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const dataUrl = `data:${image.type || "image/png"};base64,${buffer.toString("base64")}`;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: [
                            "You analyze trading chart screenshots for educational decision support.",
                            "Use only visible chart evidence and the provided symbol/timeframe.",
                            "If the image is not a readable trading chart, set entryType to Watch and explain why.",
                            "Return valid JSON only. Do not promise profit or give financial advice.",
                        ].join(" "),
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: [
                                    `Analyze this ${analysis.symbol} ${analysis.timeframe} chart screenshot.`,
                                    "Return JSON with these exact keys:",
                                    "summary, entryType, confidence, riskReward, support, resistance, stopLoss, entry, tp1, tp2.",
                                    "entryType must be Buy, Sell, or Watch.",
                                    "Use concise price/zone strings for levels. Use Watch when a trade setup is unclear.",
                                ].join(" "),
                            },
                            { type: "image_url", image_url: { url: dataUrl } },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            const detail = await safeResponseText(response);
            console.error("OpenAI chart analysis failed", response.status, detail);
            throw new AiAnalysisError("The AI analysis service failed. Check the OpenAI API key, model access, and billing.", 502);
        }

        const payload = await response.json();
        const content = payload.choices?.[0]?.message?.content;
        if (!content) throw new AiAnalysisError("The AI analysis service returned an empty result.", 502);
        const parsed = JSON.parse(content) as AiChartResult;
        const entryType = normalizeEntryType(parsed.entryType);

        return {
            ...analysis,
            summary: requireText(parsed.summary, "summary"),
            entryType,
            confidence: clampNumber(parsed.confidence, 0, 100, "confidence"),
            riskReward: clampNumber(parsed.riskReward, 0.1, 20, "riskReward"),
            support: requireText(parsed.support, "support"),
            resistance: requireText(parsed.resistance, "resistance"),
            stopLoss: requireText(parsed.stopLoss, "stopLoss"),
            entry: requireText(parsed.entry, "entry"),
            tp1: requireText(parsed.tp1, "tp1"),
            tp2: requireText(parsed.tp2, "tp2"),
        };
    } catch (error) {
        if (error instanceof AiAnalysisError) throw error;
        console.error("Unable to create AI chart analysis", error);
        throw new AiAnalysisError("The AI analysis could not be completed. Please upload a clear chart image and try again.", 502);
    }
}

const requireText = (value: unknown, field: string) => {
    if (typeof value !== "string" || !value.trim()) {
        throw new AiAnalysisError(`The AI analysis result was missing ${field}.`, 502);
    }
    return value.trim();
};

const normalizeEntryType = (value: unknown): AnalysisRecord["entryType"] => {
    if (value === "Buy" || value === "Sell" || value === "Watch") return value;
    throw new AiAnalysisError("The AI analysis result included an invalid entry type.", 502);
};

const clampNumber = (value: unknown, min: number, max: number, field: string) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        throw new AiAnalysisError(`The AI analysis result was missing ${field}.`, 502);
    }
    return Math.min(max, Math.max(min, numeric));
};

const safeResponseText = async (response: Response) => {
    try {
        return (await response.text()).slice(0, 1000);
    } catch {
        return "";
    }
};
