import { AnalysisRecord } from "./store";

interface AiChartResult {
    isCandlestickChart?: boolean;
    rejectionReason?: string;
    detectedSymbol?: string;
    detectedTimeframe?: string;
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
    if (!process.env.GEMINI_API_KEY) {
        throw new AiAnalysisError("Real AI chart analysis is not configured. Add GEMINI_API_KEY on the server and try again.", 503);
    }

    try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY,
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: [
                                    "You analyze trading chart screenshots for educational decision support.",
                                    "First decide whether the uploaded image is a readable financial candlestick chart.",
                                    "Reject the image if it is not a chart, if it has no visible candles, or if the candles/price action are too unclear to analyze.",
                                    "Use only visible chart evidence. If symbol or timeframe are visible, identify them; otherwise use Unknown.",
                                    "Do not promise profit or give financial advice.",
                                    "Return JSON with these exact keys:",
                                    "isCandlestickChart, rejectionReason, detectedSymbol, detectedTimeframe, summary, entryType, confidence, riskReward, support, resistance, stopLoss, entry, tp1, tp2.",
                                    "isCandlestickChart must be true only for a readable candlestick trading chart.",
                                    "If isCandlestickChart is false, set rejectionReason and use Watch plus Unknown/N/A values for the trading fields.",
                                    "entryType must be Buy, Sell, or Watch.",
                                    "Use concise price/zone strings for levels. Use Watch when a trade setup is unclear.",
                                ].join(" "),
                            },
                            {
                                inlineData: {
                                    mimeType: image.type || "image/png",
                                    data: buffer.toString("base64"),
                                },
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: "application/json",
                },
            }),
        });

        if (!response.ok) {
            const detail = await safeResponseText(response);
            console.error("Gemini chart analysis failed", response.status, detail);
            throw new AiAnalysisError("The AI analysis service failed. Check the Gemini API key, model access, and billing.", 502);
        }

        const payload = await response.json();
        const content = payload.candidates?.[0]?.content?.parts
            ?.map((part: { text?: string }) => part.text || "")
            .join("")
            .trim();
        if (!content) throw new AiAnalysisError("The AI analysis service returned an empty result.", 502);
        const parsed = parseJson(content) as AiChartResult;
        if (parsed.isCandlestickChart !== true) {
            const detail = parsed.rejectionReason?.trim();
            throw new AiAnalysisError(
                detail
                    ? `Please upload a clear candlestick chart image with visible candles and price action. Gemini could not analyze this image: ${detail}`
                    : "Please upload a clear candlestick chart image with visible candles and price action.",
                422
            );
        }
        const entryType = normalizeEntryType(parsed.entryType);

        return {
            ...analysis,
            symbol: cleanOptionalText(parsed.detectedSymbol, "Chart"),
            timeframe: cleanOptionalText(parsed.detectedTimeframe, "Auto"),
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

const parseJson = (content: string) => {
    try {
        return JSON.parse(content);
    } catch {
        const match = content.match(/\{[\s\S]*\}/);
        if (!match) throw new AiAnalysisError("The AI analysis service returned invalid JSON.", 502);
        return JSON.parse(match[0]);
    }
};

const requireText = (value: unknown, field: string) => {
    if (typeof value !== "string" || !value.trim()) {
        throw new AiAnalysisError(`The AI analysis result was missing ${field}.`, 502);
    }
    return value.trim();
};

const cleanOptionalText = (value: unknown, fallback: string) => {
    if (typeof value !== "string" || !value.trim()) return fallback;
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
