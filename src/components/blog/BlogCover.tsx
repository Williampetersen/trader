// Drawn candlestick cover for blog articles. The seed (the article slug) gives every article its own chart.

const sizes = {
    card: { width: 480, height: 240, count: 32 },
    wide: { width: 1200, height: 340, count: 72 },
};

const createRandom = (seed: string) => {
    let state = 0;
    for (const char of seed) state = (state * 31 + char.charCodeAt(0)) >>> 0;
    return () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state / 2 ** 32;
    };
};

const buildCandles = (seed: string, count: number) => {
    const random = createRandom(seed);
    const drift = random() > 0.35 ? 0.35 : -0.35;
    const candles: { open: number; high: number; low: number; close: number }[] = [];
    let price = 0;
    for (let index = 0; index < count; index++) {
        const open = price;
        const close = open + drift + (random() - 0.5) * 3;
        candles.push({ open, close, high: Math.max(open, close) + random() * 1.2, low: Math.min(open, close) - random() * 1.2 });
        price = close;
    }
    return candles;
};

const BlogCover = ({ seed, className = "", variant = "card" }: { seed: string; className?: string; variant?: keyof typeof sizes }) => {
    const { width, height, count } = sizes[variant];
    const candles = buildCandles(seed, count);
    const max = Math.max(...candles.map((candle) => candle.high));
    const min = Math.min(...candles.map((candle) => candle.low));
    const y = (price: number) => 36 + ((max - price) / (max - min)) * (height - 72);
    const step = (width - 64) / count;
    const last = candles[candles.length - 1].close;

    return (
        <div className={`bg-canvas ${className}`}>
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
                {[0.25, 0.5, 0.75].map((fraction) => (
                    <line key={fraction} x1={0} x2={width} y1={height * fraction} y2={height * fraction} stroke="#e8e8ed" />
                ))}
                <line x1={0} x2={width} y1={y(last)} y2={y(last)} stroke="#0071e3" strokeWidth={1.25} strokeDasharray="4 4" />
                {candles.map((candle, index) => {
                    const x = 32 + index * step + step / 2;
                    const color = candle.close >= candle.open ? "#34c759" : "#ff3b30";
                    const top = y(Math.max(candle.open, candle.close));
                    return (
                        <g key={index}>
                            <line x1={x} x2={x} y1={y(candle.high)} y2={y(candle.low)} stroke={color} strokeWidth={1.25} />
                            <rect x={x - step * 0.3} y={top} width={step * 0.6} height={Math.max(y(Math.min(candle.open, candle.close)) - top, 1.5)} rx={1} fill={color} />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default BlogCover;
