import { AnalysisRecord } from "./store";

interface AiChartResult {
    isCandlestickChart?: boolean;
    rejectionReason?: string;
    detectedSymbol?: string;
    detectedTimeframe?: string;
    summary?: string;
    entryType?: "Buy" | "Sell" | "Watch";
    confidence?: number | string;
    riskReward?: number | string;
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
    if (!process.env.OPENROUTER_API_KEY) {
        throw new AiAnalysisError("Real AI chart analysis is not configured. Add OPENROUTER_API_KEY on the server and try again.", 503);
    }

    try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const dataUrl = `data:${image.type || "image/png"};base64,${buffer.toString("base64")}`;
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://gptchartview.com",
                "X-OpenRouter-Title": "GPT Chart View",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: [
                            "You analyze trading chart screenshots for educational decision support.",
                            "Return valid JSON only. Do not wrap it in markdown.",
                            "Do not promise profit or give financial advice.",
                        ].join(" "),
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: [
                                    "First decide whether the uploaded image is a readable financial candlestick chart.",
                                    "Reject the image if it is not a chart, if it has no visible candles, or if the candles/price action are too unclear to analyze.",
                                    "Use only visible chart evidence. If symbol or timeframe are visible, identify them; otherwise use Unknown.",
                                    "Return JSON with these exact keys:",
                                    "isCandlestickChart, rejectionReason, detectedSymbol, detectedTimeframe, summary, entryType, confidence, riskReward, support, resistance, stopLoss, entry, tp1, tp2.",
                                    "isCandlestickChart must be true only for a readable candlestick trading chart.",
                                    "If isCandlestickChart is false, set rejectionReason and use Watch plus Unknown/N/A values for the trading fields.",
                                    "entryType must be Buy, Sell, or Watch.",
                                    "confidence must be a number from 0 to 100.",
                                    "riskReward must be a decimal number such as 1.5 or 2.0.",
                                    "Use concise price/zone strings for levels. Use Watch when a trade setup is unclear.",
                                ].join(" "),
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: dataUrl,
                                },
                            },
                        ],
                    },
                ],
                temperature: 0.2,
                max_tokens: 1200,
                response_format: {
                    type: "json_schema",
                    json_schema: {
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
                                confidence: { type: "number", minimum: 0, maximum: 100 },
                                riskReward: { type: "number", minimum: 0.1, maximum: 20 },
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
            console.error("OpenRouter chart analysis failed", response.status, detail);
            throw new AiAnalysisError(openRouterErrorMessage(response.status, detail), statusForOpenRouterError(response.status));
        }

        const payload = await response.json();
        const content = normalizeMessageContent(payload.choices?.[0]?.message?.content);
        if (!content) throw new AiAnalysisError("The AI analysis service returned an empty result.", 502);
        const parsed = parseJson(content) as AiChartResult;
        if (parsed.isCandlestickChart !== true) {
            const detail = parsed.rejectionReason?.trim();
            throw new AiAnalysisError(
                detail
                    ? `Please upload a clear candlestick chart image with visible candles and price action. OpenRouter could not analyze this image: ${detail}`
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
            confidence: parseRequiredNumber(parsed.confidence, 0, 100, "confidence"),
            riskReward: parseRequiredNumber(parsed.riskReward, 0.1, 20, "riskReward"),
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

const normalizeMessageContent = (content: unknown) => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === "string") return part;
                if (part && typeof part === "object" && "text" in part) return String(part.text || "");
                return "";
            })
            .join("")
            .trim();
    }
    return "";
};

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

const parseRequiredNumber = (value: unknown, min: number, max: number, field: string) => {
    const numeric = parseNumber(value);
    if (!Number.isFinite(numeric)) {
        throw new AiAnalysisError(`The AI analysis result was missing ${field}.`, 502);
    }
    return Math.min(max, Math.max(min, numeric));
};

const parseNumber = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return Number.NaN;
    const ratio = value.match(/1\s*[:/]\s*(\d+(?:\.\d+)?)/);
    if (ratio) return Number(ratio[1]);
    const numeric = value.match(/-?\d+(?:\.\d+)?/);
    return numeric ? Number(numeric[0]) : Number.NaN;
};

const safeResponseText = async (response: Response) => {
    try {
        return (await response.text()).slice(0, 1000);
    } catch {
        return "";
    }
};

const openRouterErrorMessage = (status: number, detail: string) => {
    const apiMessage = parseProviderErrorMessage(detail);
    const suffix = apiMessage ? ` OpenRouter said: ${apiMessage}` : "";

    if (status === 401) return `OpenRouter rejected the API key. Check OPENROUTER_API_KEY in Vercel and redeploy.${suffix}`;
    if (status === 402) return `OpenRouter credits are required for this model. Add credits to OpenRouter or choose a free vision model.${suffix}`;
    if (status === 403) return `OpenRouter denied access for this key or model. Check key permissions and model access.${suffix}`;
    if (status === 404) return `OpenRouter could not find the built-in chart analysis model. Contact support or try again later.${suffix}`;
    if (status === 429) return `OpenRouter rate limit or credits are blocking analysis. Check OpenRouter credits, limits, and model access.${suffix}`;
    if (status >= 500) return `OpenRouter or the selected model provider is temporarily failing. Try again in a few minutes.${suffix}`;
    return `OpenRouter could not analyze the chart. Check OPENROUTER_API_KEY, credits, and model access.${suffix}`;
};

const parseProviderErrorMessage = (detail: string) => {
    try {
        const payload = JSON.parse(detail) as { error?: { message?: string } };
        return payload.error?.message?.trim();
    } catch {
        return "";
    }
};

const statusForOpenRouterError = (status: number) => {
    if (status === 400 || status === 401 || status === 402 || status === 403 || status === 404 || status === 429) return status;
    return 502;
};
