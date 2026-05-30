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

export async function enrichAnalysisWithAi(analysis: AnalysisRecord, image: File): Promise<AnalysisRecord> {
    if (!process.env.OPENAI_API_KEY) return analysis;

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
                        content: "You analyze trading chart screenshots for educational decision support. Return valid JSON only. Do not promise profit or give financial advice.",
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Analyze this ${analysis.symbol} ${analysis.timeframe} chart. Return JSON with summary, entryType (Buy/Sell/Watch), confidence (0-100), riskReward, support, resistance, stopLoss, entry, tp1, tp2.`,
                            },
                            { type: "image_url", image_url: { url: dataUrl } },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) return analysis;
        const payload = await response.json();
        const content = payload.choices?.[0]?.message?.content;
        if (!content) return analysis;
        const parsed = JSON.parse(content) as AiChartResult;

        return {
            ...analysis,
            summary: parsed.summary || analysis.summary,
            entryType: parsed.entryType || analysis.entryType,
            confidence: clampNumber(parsed.confidence, analysis.confidence, 0, 100),
            riskReward: clampNumber(parsed.riskReward, analysis.riskReward, 0.1, 20),
            support: parsed.support || analysis.support,
            resistance: parsed.resistance || analysis.resistance,
            stopLoss: parsed.stopLoss || analysis.stopLoss,
            entry: parsed.entry || analysis.entry,
            tp1: parsed.tp1 || analysis.tp1,
            tp2: parsed.tp2 || analysis.tp2,
        };
    } catch {
        return analysis;
    }
}

const clampNumber = (value: unknown, fallback: number, min: number, max: number) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.min(max, Math.max(min, numeric));
};
