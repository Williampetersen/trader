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
    if (!process.env.OPENAI_API_KEY) {
        throw new AiAnalysisError("Real AI chart analysis is not configured. Add OPENAI_API_KEY on the server and try again.", 503);
    }

    try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const dataUrl = `data:${image.type || "image/png"};base64,${buffer.toString("base64")}`;
        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || "gpt-4o-mini",
                input: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "input_text",
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
                                type: "input_image",
                                image_url: dataUrl,
                            },
                        ],
                    },
                ],
                temperature: 0.2,
                text: {
                    format: {
                        type: "json_schema",
                        name: "chart_analysis",
                        strict: true,
                        schema: {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                isCandlestickChart: { type: "boolean" },
                                rejectionReason: { type: "string" },
                                detectedSymbol: { type: "string" },
                                detectedTimeframe: { type: "string" },
                                summary: { type: "string" },
                                entryType: { type: "string", enum: ["Buy", "Sell", "Watch"] },
                                confidence: { type: "number" },
                                riskReward: { type: "number" },
                                support: { type: "string" },
                                resistance: { type: "string" },
                                stopLoss: { type: "string" },
                                entry: { type: "string" },
                                tp1: { type: "string" },
                                tp2: { type: "string" },
                            },
                            required: [
                                "isCandlestickChart",
                                "rejectionReason",
                                "detectedSymbol",
                                "detectedTimeframe",
                                "summary",
                                "entryType",
                                "confidence",
                                "riskReward",
                                "support",
                                "resistance",
                                "stopLoss",
                                "entry",
                                "tp1",
                                "tp2",
                            ],
                        },
                    },
                },
            }),
        });

        if (!response.ok) {
            const detail = await safeResponseText(response);
            console.error("OpenAI chart analysis failed", response.status, detail);
            throw new AiAnalysisError(openAiErrorMessage(response.status, detail), statusForOpenAiError(response.status));
        }

        const payload = await response.json();
        const content = typeof payload.output_text === "string"
            ? payload.output_text
            : payload.output
                ?.flatMap((item: { content?: { text?: string }[] }) => item.content || [])
                .map((item: { text?: string }) => item.text || "")
                .join("")
                .trim();
        if (!content) throw new AiAnalysisError("The AI analysis service returned an empty result.", 502);
        const parsed = parseJson(content) as AiChartResult;
        if (parsed.isCandlestickChart !== true) {
            const detail = parsed.rejectionReason?.trim();
            throw new AiAnalysisError(
                detail
                    ? `Please upload a clear candlestick chart image with visible candles and price action. OpenAI could not analyze this image: ${detail}`
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

const openAiErrorMessage = (status: number, detail: string) => {
    const apiMessage = parseOpenAiErrorMessage(detail);
    const suffix = apiMessage ? ` OpenAI said: ${apiMessage}` : "";

    if (status === 401) return `OpenAI rejected the API key. Check OPENAI_API_KEY in Vercel and redeploy.${suffix}`;
    if (status === 403) return `OpenAI denied access for this key or project. Check project permissions and model access.${suffix}`;
    if (status === 404) return `OpenAI could not find the configured model. Set OPENAI_MODEL to gpt-4o-mini in Vercel and redeploy.${suffix}`;
    if (status === 429) return `OpenAI quota or billing is blocking analysis. Add billing/credits to the OpenAI project or use a funded key.${suffix}`;
    if (status >= 500) return `OpenAI is temporarily failing. Try again in a few minutes.${suffix}`;
    return `OpenAI could not analyze the chart. Check OPENAI_API_KEY, OPENAI_MODEL, project billing, and model access.${suffix}`;
};

const parseOpenAiErrorMessage = (detail: string) => {
    try {
        const payload = JSON.parse(detail) as { error?: { message?: string } };
        return payload.error?.message?.trim();
    } catch {
        return "";
    }
};

const statusForOpenAiError = (status: number) => {
    if (status === 400 || status === 401 || status === 403 || status === 404 || status === 429) return status;
    return 502;
};
