import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { AnalysisRecord } from "./store";

// Cheapest Claude model with vision; switch to "claude-sonnet-5" for better chart reading.
const CLAUDE_MODEL = "claude-haiku-4-5";
const OPENROUTER_MODEL = "openai/gpt-4o-mini";

const ChartResultSchema = z.object({
    isCandlestickChart: z.boolean(),
    rejectionReason: z.string(),
    detectedSymbol: z.string(),
    detectedTimeframe: z.string(),
    summary: z.string(),
    entryType: z.enum(["Buy", "Sell", "Watch"]),
    confidence: z.number(),
    riskReward: z.number(),
    support: z.string(),
    resistance: z.string(),
    stopLoss: z.string(),
    entry: z.string(),
    tp1: z.string(),
    tp2: z.string(),
});

type AiChartResult = z.infer<typeof ChartResultSchema>;

export interface ChartHints {
    symbol?: string;
    timeframe?: string;
}

interface ChartImage {
    mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    base64: string;
}

export class AiAnalysisError extends Error {
    constructor(message: string, public readonly status = 503) {
        super(message);
        this.name = "AiAnalysisError";
    }
}

const SYSTEM_PROMPT = [
    "You are a technical analyst who reads trading chart screenshots for educational decision support.",
    "Use only evidence visible in the image. Do not promise profit or give financial advice.",
].join(" ");

const buildPrompt = (hints: ChartHints, feedback?: string) => [
    "Analyze this chart screenshot in this order:",
    "1. Decide whether it is a readable financial candlestick chart. If it is not a chart, has no visible candles, or the price action is too unclear, set isCandlestickChart to false, explain why in rejectionReason, set entryType to Watch and use N/A for the price fields.",
    "2. Read the symbol and timeframe from the chart title, legend or toolbar. Use Unknown if they are not visible.",
    "3. Read the price axis carefully so every level you give uses real prices from this chart's scale, with the same decimal precision.",
    "4. Identify the trend and market structure (higher highs/lows or lower highs/lows), and the nearest support and resistance zones.",
    "5. Decide Buy, Sell or Watch. Use Watch when there is no clear setup.",
    "6. For Buy or Sell: entry near the current price or a nearby pullback level; stopLoss just beyond the most recent swing low (Buy) or swing high (Sell); tp1 at the next support/resistance level; tp2 at the level after that.",
    "   For a Buy: stopLoss < entry < tp1 <= tp2. For a Sell: stopLoss > entry > tp1 >= tp2.",
    "7. confidence is a number from 0 to 100. riskReward is the reward-to-risk ratio to tp1 as a decimal, such as 1.8.",
    "8. summary: two or three sentences explaining the trend, the key levels and why this setup was chosen.",
    "Give each price field as a single number string (for example 1.0852 or 64020), not a range.",
    hints.symbol ? `The user says the symbol is ${hints.symbol}. Use it unless the chart clearly shows a different symbol.` : "",
    hints.timeframe ? `The user says the timeframe is ${hints.timeframe}. Use it unless the chart clearly shows a different timeframe.` : "",
    feedback ? `Your previous answer for this chart had these problems: ${feedback} Correct them.` : "",
].filter(Boolean).join("\n");

export async function enrichAnalysisWithAi(analysis: AnalysisRecord, image: File, hints: ChartHints = {}): Promise<AnalysisRecord> {
    const analyze = pickProvider();
    const chartImage = await toChartImage(image);

    try {
        let result = requireChart(await analyze(chartImage, buildPrompt(hints)));
        let problems = levelProblems(result);

        if (problems.length) {
            result = requireChart(await analyze(chartImage, buildPrompt(hints, problems.join(" "))));
            problems = levelProblems(result);
        }

        if (problems.length) {
            result = {
                ...result,
                entryType: "Watch",
                summary: `${result.summary.trim()} No trade signal: the AI could not produce consistent entry, stop-loss and take-profit levels for this chart.`,
            };
        }

        return {
            ...analysis,
            symbol: cleanOptionalText(hints.symbol, "") || cleanOptionalText(result.detectedSymbol, "Chart"),
            timeframe: cleanOptionalText(hints.timeframe, "") || cleanOptionalText(result.detectedTimeframe, "Auto"),
            summary: requireText(result.summary, "summary"),
            entryType: result.entryType,
            confidence: clamp(result.confidence, 0, 100, "confidence"),
            riskReward: computeRiskReward(result) ?? clamp(result.riskReward, 0.1, 20, "riskReward"),
            support: requireText(result.support, "support"),
            resistance: requireText(result.resistance, "resistance"),
            stopLoss: requireText(result.stopLoss, "stopLoss"),
            entry: requireText(result.entry, "entry"),
            tp1: requireText(result.tp1, "tp1"),
            tp2: requireText(result.tp2, "tp2"),
        };
    } catch (error) {
        if (error instanceof AiAnalysisError) throw error;
        console.error("Unable to create AI chart analysis", error);
        throw new AiAnalysisError("The AI analysis could not be completed. Please upload a clear chart image and try again.", 502);
    }
}

type Analyzer = (image: ChartImage, prompt: string) => Promise<AiChartResult>;

const pickProvider = (): Analyzer => {
    if (process.env.ANTHROPIC_API_KEY) return analyzeWithClaude;
    if (process.env.OPENROUTER_API_KEY) return analyzeWithOpenRouter;
    throw new AiAnalysisError("Real AI chart analysis is not configured. Add ANTHROPIC_API_KEY on the server and try again.", 503);
};

let claudeClient: Anthropic | null = null;

const analyzeWithClaude: Analyzer = async (image, prompt) => {
    claudeClient ||= new Anthropic();
    try {
        const response = await claudeClient.messages.parse({
            model: CLAUDE_MODEL,
            max_tokens: 2000,
            temperature: 0.2,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.base64 } },
                        { type: "text", text: prompt },
                    ],
                },
            ],
            output_config: { format: zodOutputFormat(ChartResultSchema) },
        });

        if (response.stop_reason === "refusal") {
            throw new AiAnalysisError("The AI could not analyze this image. Please upload a clear candlestick chart screenshot.", 422);
        }
        if (response.stop_reason === "max_tokens" || !response.parsed_output) {
            throw new AiAnalysisError("The AI analysis service returned an incomplete result. Please try again.", 502);
        }
        return response.parsed_output;
    } catch (error) {
        if (error instanceof Anthropic.APIError) {
            console.error("Claude chart analysis failed", error.status, error.message);
            throw new AiAnalysisError(claudeErrorMessage(error.status), statusForProviderError(error.status));
        }
        throw error;
    }
};

const claudeErrorMessage = (status: number | undefined) => {
    if (status === 401) return "Claude rejected the API key. Check ANTHROPIC_API_KEY in Vercel and redeploy.";
    if (status === 402) return "The Claude API account needs credits. Add credits in the Claude Console billing page.";
    if (status === 403) return "The Claude API key is not allowed to use this model. Check the key's workspace permissions.";
    if (status === 429) return "Chart analysis is busy right now (rate limit). Please try again in a minute.";
    if (status === 529 || (status && status >= 500)) return "The Claude AI service is temporarily unavailable. Please try again in a few minutes.";
    return "The Claude AI service could not analyze the chart. Please try again.";
};

const analyzeWithOpenRouter: Analyzer = async (image, prompt) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://gptchartview.com",
            "X-OpenRouter-Title": "GPT Chart View",
        },
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
                { role: "system", content: `${SYSTEM_PROMPT} Return valid JSON only. Do not wrap it in markdown.` },
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: `data:${image.mediaType};base64,${image.base64}` } },
                    ],
                },
            ],
            temperature: 0.2,
            max_tokens: 1200,
            response_format: {
                type: "json_schema",
                json_schema: { name: "chart_analysis", strict: true, schema: openRouterSchema() },
            },
        }),
    });

    if (!response.ok) {
        const detail = await safeResponseText(response);
        console.error("OpenRouter chart analysis failed", response.status, detail);
        throw new AiAnalysisError(openRouterErrorMessage(response.status, detail), statusForProviderError(response.status));
    }

    const payload = await response.json();
    const content = normalizeMessageContent(payload.choices?.[0]?.message?.content);
    if (!content) throw new AiAnalysisError("The AI analysis service returned an empty result.", 502);
    const parsed = ChartResultSchema.safeParse(parseJson(content));
    if (!parsed.success) throw new AiAnalysisError("The AI analysis service returned an invalid result.", 502);
    return parsed.data;
};

const openRouterSchema = () => {
    const { $schema: _unused, ...schema } = z.toJSONSchema(ChartResultSchema) as Record<string, unknown>;
    void _unused;
    return { ...schema, additionalProperties: false };
};

const toChartImage = async (image: File): Promise<ChartImage> => {
    const type = image.type === "image/jpg" ? "image/jpeg" : image.type || "image/png";
    if (type !== "image/jpeg" && type !== "image/png" && type !== "image/gif" && type !== "image/webp") {
        throw new AiAnalysisError("Upload a PNG, JPG, or WEBP chart image.", 400);
    }
    const buffer = Buffer.from(await image.arrayBuffer());
    return { mediaType: type, base64: buffer.toString("base64") };
};

const requireChart = (result: AiChartResult) => {
    if (result.isCandlestickChart !== true) {
        const detail = result.rejectionReason?.trim();
        throw new AiAnalysisError(
            detail
                ? `Please upload a clear candlestick chart image with visible candles and price action. The AI could not analyze this image: ${detail}`
                : "Please upload a clear candlestick chart image with visible candles and price action.",
            422
        );
    }
    return result;
};

// Checks that stop-loss and take-profits sit on the correct side of the entry for the trade direction.
const levelProblems = (result: AiChartResult) => {
    if (result.entryType === "Watch") return [];
    const entry = parsePrice(result.entry);
    const stopLoss = parsePrice(result.stopLoss);
    const tp1 = parsePrice(result.tp1);
    const tp2 = parsePrice(result.tp2);
    if (![entry, stopLoss, tp1, tp2].every(Number.isFinite)) {
        return ["entry, stopLoss, tp1 and tp2 must each be a single price number read from the chart's price axis."];
    }

    const problems: string[] = [];
    if (result.entryType === "Buy") {
        if (!(stopLoss < entry)) problems.push("For a Buy, stopLoss must be below entry.");
        if (!(tp1 > entry)) problems.push("For a Buy, tp1 must be above entry.");
        if (!(tp2 >= tp1)) problems.push("For a Buy, tp2 must be at or above tp1.");
    } else {
        if (!(stopLoss > entry)) problems.push("For a Sell, stopLoss must be above entry.");
        if (!(tp1 < entry)) problems.push("For a Sell, tp1 must be below entry.");
        if (!(tp2 <= tp1)) problems.push("For a Sell, tp2 must be at or below tp1.");
    }
    return problems;
};

const computeRiskReward = (result: AiChartResult) => {
    if (result.entryType === "Watch") return null;
    const entry = parsePrice(result.entry);
    const risk = Math.abs(entry - parsePrice(result.stopLoss));
    const reward = Math.abs(parsePrice(result.tp1) - entry);
    if (!Number.isFinite(risk) || !Number.isFinite(reward) || risk === 0) return null;
    return Math.min(20, Math.max(0.1, Math.round((reward / risk) * 100) / 100));
};

// Parses the first price in a string, handling thousands separators ("64,020") and decimal commas ("1,0852").
const parsePrice = (value: string) => {
    const normalized = value.replace(/(\d),(?=\d{3}(?!\d))/g, "$1").replace(/(\d),(\d)/g, "$1.$2");
    const match = normalized.match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : Number.NaN;
};

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

const clamp = (value: number, min: number, max: number, field: string) => {
    if (!Number.isFinite(value)) throw new AiAnalysisError(`The AI analysis result was missing ${field}.`, 502);
    return Math.min(max, Math.max(min, value));
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

const statusForProviderError = (status: number | undefined) => {
    if (status === 400 || status === 401 || status === 402 || status === 403 || status === 404 || status === 429) return status;
    return 502;
};
