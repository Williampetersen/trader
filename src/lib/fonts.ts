import { Inter } from "next/font/google";

// apple.com uses Apple's SF Pro, which Apple only licenses for its own platforms, so it can't be served as a web font.
// The font stack in tailwind.config.ts shows the real SF Pro on Apple devices; everywhere else this Inter
// (the closest open-source match, including its optical sizes) is used instead.
export const inter = Inter({ subsets: ["latin"], axes: ["opsz"], display: "swap", variable: "--font-inter" });
