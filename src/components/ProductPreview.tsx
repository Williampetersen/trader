// Static example of an analysis result, drawn to look like the member app. Illustration only.

// [open, high, low, close] for the example BTCUSDT 1H chart.
const candles: [number, number, number, number][] = [
    [62600, 62831, 62505, 62796], [62796, 63029, 62745, 62968], [62968, 63049, 62816, 62902], [62902, 63048, 62823, 62955],
    [62955, 63226, 62892, 63132], [63132, 63215, 63013, 63107], [63107, 63186, 63069, 63123], [63123, 63508, 63031, 63470],
    [63470, 63733, 63401, 63675], [63675, 63842, 63601, 63763], [63763, 64142, 63674, 64050], [64050, 64373, 64005, 64279],
    [64279, 64375, 64184, 64290], [64290, 64408, 64233, 64342], [64342, 64547, 64259, 64506], [64506, 64561, 64387, 64470],
    [64470, 64585, 64413, 64508], [64508, 64615, 64413, 64524], [64524, 64619, 64312, 64357], [64357, 64444, 64000, 64089],
    [64089, 64158, 63947, 64021], [64021, 64065, 63800, 63869], [63869, 63921, 63539, 63631], [63631, 63706, 63556, 63594],
    [63594, 63735, 63500, 63645], [63645, 63740, 63431, 63494], [63494, 63582, 63355, 63434], [63434, 63764, 63348, 63693],
    [63693, 63784, 63642, 63737], [63737, 63786, 63613, 63708], [63708, 63960, 63657, 63887], [63887, 64044, 63801, 63955],
    [63955, 64050, 63801, 63880], [63880, 64121, 63817, 64032], [64032, 64308, 63938, 64235], [64235, 64285, 64189, 64227],
    [64227, 64273, 64063, 64155], [64155, 64278, 64086, 64208], [64208, 64296, 63953, 64027], [64027, 64122, 63728, 63817],
    [63817, 64033, 63772, 63942], [63942, 64032, 63847, 63956], [63956, 64009, 63805, 63862], [63862, 64063, 63779, 64020],
];

const levels = {
    tp2: 66850,
    tp1: 65400,
    entry: 64020,
    stop: 63180,
    support: 63350,
    resistance: 64600,
};

const riskReward = (levels.tp1 - levels.entry) / (levels.entry - levels.stop);

const WIDTH = 640;
const HEIGHT = 480;
const PRICE_TOP = 67300;
const PRICE_BOTTOM = 62300;
const PLOT_TOP = 20;
const PLOT_HEIGHT = 440;
const CANDLE_START = 20;
const CANDLE_STEP = 9.3;
const ZONE_START = 428;
const ZONE_END = 540;

const green = "#34c759";
const red = "#ff3b30";

const y = (price: number) => PLOT_TOP + ((PRICE_TOP - price) / (PRICE_TOP - PRICE_BOTTOM)) * PLOT_HEIGHT;
const formatPrice = (price: number) => price.toLocaleString("en-US");

const chartLabels = [
    { label: "TP2", price: levels.tp2, className: "bg-[#248a3d]" },
    { label: "TP1", price: levels.tp1, className: "bg-[#248a3d]" },
    { label: "Entry", price: levels.entry, className: "bg-accent" },
    { label: "SL", price: levels.stop, className: "bg-[#d70015]" },
];

const levelTiles = [
    { label: "Entry", price: levels.entry, className: "text-ink" },
    { label: "Stop-loss", price: levels.stop, className: "text-[#d70015]" },
    { label: "Target 1", price: levels.tp1, className: "text-[#248a3d]" },
    { label: "Target 2", price: levels.tp2, className: "text-[#248a3d]" },
];

const ProductPreview: React.FC = () => {
    return (
        <figure className="mx-auto max-w-[1100px]">
            <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06]">
                <div className="flex items-center border-b border-black/[0.06] bg-[#fbfbfd] px-5 py-3">
                    <div className="flex w-14 gap-1.5" aria-hidden="true">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                    </div>
                    <p className="mx-auto rounded-md bg-canvas px-6 py-1 text-xs text-muted sm:px-12">gptchartview.com</p>
                    <div className="w-14" />
                </div>

                <div className="grid text-left md:grid-cols-[1.45fr_1fr]">
                    <div className="border-b border-black/[0.06] p-4 md:border-b-0 md:border-r md:p-6">
                        <p className="text-xs text-muted">Uploaded chart</p>
                        <div className="relative mt-3 aspect-[4/3]">
                            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Example BTCUSDT one-hour candlestick chart with entry, stop-loss and target levels">
                                {[63000, 64000, 65000, 66000, 67000].map((price) => (
                                    <line key={price} x1={0} x2={WIDTH} y1={y(price)} y2={y(price)} stroke="#e8e8ed" strokeWidth={1} />
                                ))}

                                <rect x={ZONE_START} y={y(levels.tp1)} width={ZONE_END - ZONE_START} height={y(levels.entry) - y(levels.tp1)} fill={green} fillOpacity={0.14} />
                                <rect x={ZONE_START} y={y(levels.entry)} width={ZONE_END - ZONE_START} height={y(levels.stop) - y(levels.entry)} fill={red} fillOpacity={0.12} />

                                <line x1={0} x2={ZONE_END} y1={y(levels.tp2)} y2={y(levels.tp2)} stroke={green} strokeWidth={1.25} strokeDasharray="4 4" />
                                <line x1={0} x2={ZONE_END} y1={y(levels.tp1)} y2={y(levels.tp1)} stroke={green} strokeWidth={1.25} strokeDasharray="4 4" />
                                <line x1={0} x2={ZONE_END} y1={y(levels.stop)} y2={y(levels.stop)} stroke={red} strokeWidth={1.25} strokeDasharray="4 4" />
                                <line x1={0} x2={ZONE_END} y1={y(levels.entry)} y2={y(levels.entry)} stroke="#0071e3" strokeWidth={1.5} />

                                {candles.map(([open, high, low, close], index) => {
                                    const x = CANDLE_START + index * CANDLE_STEP;
                                    const color = close >= open ? green : red;
                                    const bodyTop = y(Math.max(open, close));
                                    const bodyHeight = Math.max(y(Math.min(open, close)) - bodyTop, 1);
                                    return (
                                        <g key={index}>
                                            <line x1={x} x2={x} y1={y(high)} y2={y(low)} stroke={color} strokeWidth={1.25} />
                                            <rect x={x - 2.8} y={bodyTop} width={5.6} height={bodyHeight} rx={0.8} fill={color} />
                                        </g>
                                    );
                                })}
                            </svg>

                            {chartLabels.map((item) => (
                                <span
                                    key={item.label}
                                    className={`absolute right-0 -translate-y-1/2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums tracking-normal text-white sm:text-[11px] ${item.className}`}
                                    style={{ top: `${(y(item.price) / HEIGHT) * 100}%` }}
                                >
                                    {item.label}<span className="hidden sm:inline"> {formatPrice(item.price)}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs text-muted">AI chart analysis</p>
                                <p className="mt-0.5 text-[19px] font-semibold tracking-[-0.015em]">BTCUSDT · 1H</p>
                            </div>
                            <span className="rounded-full bg-[#34c759]/15 px-3 py-1 text-[13px] font-semibold text-[#248a3d]">Buy</span>
                        </div>

                        <dl className="mt-6 grid grid-cols-2 gap-2.5">
                            {levelTiles.map((tile) => (
                                <div key={tile.label} className="rounded-2xl bg-canvas px-4 py-3">
                                    <dt className="text-xs text-muted">{tile.label}</dt>
                                    <dd className={`mt-0.5 text-[17px] font-semibold tabular-nums ${tile.className}`}>{formatPrice(tile.price)}</dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-6">
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="text-muted">Confidence</span>
                                <span className="font-semibold tabular-nums">78%</span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas">
                                <div className="h-full w-[78%] rounded-full bg-[#34c759]" />
                            </div>
                        </div>

                        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-black/[0.06] pt-5 text-[13px]">
                            <div>
                                <dt className="text-muted">Risk / reward</dt>
                                <dd className="mt-0.5 font-semibold tabular-nums">1 : {riskReward.toFixed(1)}</dd>
                            </div>
                            <div>
                                <dt className="text-muted">Support</dt>
                                <dd className="mt-0.5 font-semibold tabular-nums">{formatPrice(levels.support)}</dd>
                            </div>
                            <div>
                                <dt className="text-muted">Resistance</dt>
                                <dd className="mt-0.5 font-semibold tabular-nums">{formatPrice(levels.resistance)}</dd>
                            </div>
                        </dl>

                        <p className="mt-5 text-[15px] leading-[1.5] text-muted">
                            Higher low held at {formatPrice(levels.support)} support. A close above {formatPrice(levels.resistance)} would confirm the move; a break below {formatPrice(levels.stop)} invalidates it.
                        </p>
                    </div>
                </div>
            </div>
            <figcaption className="mt-4 text-center text-xs text-subtle">Example output for illustration only. Not a trade recommendation.</figcaption>
        </figure>
    );
};

export default ProductPreview;
