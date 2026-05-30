import { FiCpu, FiImage, FiLock, FiTrendingUp } from "react-icons/fi";

const trustItems = [
    {
        title: "Image upload",
        description: "Built around chart screenshots, not manual form entry.",
        icon: <FiImage size={24} />,
    },
    {
        title: "AI analysis",
        description: "Structured technical reads with clear trade context.",
        icon: <FiCpu size={24} />,
    },
    {
        title: "Risk aware",
        description: "Scores include invalidation, caution notes, and uncertainty.",
        icon: <FiLock size={24} />,
    },
    {
        title: "Multi-market",
        description: "Positioned for forex, crypto, stocks, indices, and commodities.",
        icon: <FiTrendingUp size={24} />,
    },
];

const Logos: React.FC = () => {
    return (
        <section id="logos" className="px-5 py-20 bg-background">
            <p className="text-lg font-medium text-center">
                Built for traders who want <span className="text-secondary">faster chart review</span> before risking capital
            </p>
            <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {trustItems.map((item) => (
                    <div key={item.title} className="rounded-lg border border-gray-200 bg-white p-5">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                            {item.icon}
                        </div>
                        <h2 className="text-xl font-semibold">{item.title}</h2>
                        <p className="mt-2 text-base text-foreground-accent">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Logos
