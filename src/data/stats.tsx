import { BsBarChartFill, BsFillStarFill } from "react-icons/bs";
import { PiGlobeFill } from "react-icons/pi";

import { IStats } from "@/types";

export const stats: IStats[] = [
    {
        title: "60 sec",
        icon: <BsBarChartFill size={34} className="text-blue-500" />,
        description: "Target turnaround for a concise chart read after upload."
    },
    {
        title: "0-100",
        icon: <BsFillStarFill size={34} className="text-yellow-500" />,
        description: "Simple trade-quality score for quick setup comparison."
    },
    {
        title: "24/7",
        icon: <PiGlobeFill size={34} className="text-green-600" />,
        description: "Subscription access for traders reviewing charts across markets."
    }
];
