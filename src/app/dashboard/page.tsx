import clsx from "clsx";
import Link from "next/link";
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiClock, FiCreditCard, FiFileText, FiMessageSquare, FiTarget, FiUpload } from "react-icons/fi";
import { requireUser } from "@/lib/server/auth";
import { readDb } from "@/lib/server/store";
import { Badge, Disclaimer, IconTile, Panel, PanelHeader, StatCard, StatGrid, outlineButtonClass, primaryButtonClass, type Tone } from "@/components/dashboard/DashboardUi";

const DashboardPage = async () => {
    const user = await requireUser();
    const db = await readDb();
    const analyses = db.analyses.filter((item) => item.userId === user.id);
    const aiResponses = db.chats.filter((item) => item.userId === user.id && item.role === "assistant").length;
    const recent = analyses.slice(-5).reverse();
    const bars = [1, 2, 3, 4, 5, 6].map((_, index) => (analyses.length ? 25 + ((analyses.length + index * 13) % 70) : 8));
    const profileComplete = Boolean(user.name && user.profile.mobile && user.profile.country && user.profile.gender && user.profile.ageGroup);
    const creditPercent = user.plan.creditsLeft === 0 ? 0 : Math.max(6, (user.plan.creditsLeft / user.plan.dailyLimit) * 100);

    return (
        <div className="space-y-8">
            <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                <div className="grid gap-6 bg-[radial-gradient(circle_at_0%_0%,rgba(52,87,255,0.10),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.06),transparent_40%)] p-6 lg:grid-cols-[1fr_360px] lg:p-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#3457ff]">Today&apos;s review desk</p>
                        <h2 className="mt-2 text-3xl font-bold text-slate-800">Welcome back, {user.name}</h2>
                        <p className="mt-3 max-w-2xl text-slate-500">Upload chart screenshots, get a structured AI read, and keep your trade review process organized in one workspace.</p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link href="/dashboard/upload" className={clsx(primaryButtonClass, "px-6 py-3")}>
                                <FiUpload /> Upload chart
                            </Link>
                            <Link href={recent[0] ? `/dashboard/results?id=${recent[0].id}` : "/dashboard/history"} className={clsx(outlineButtonClass, "px-6 py-3")}>
                                <FiTarget /> Review latest
                            </Link>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">{user.plan.name} usage</p>
                            <Badge tone="blue">Credits left</Badge>
                        </div>
                        <strong className="mt-3 block text-4xl font-bold text-slate-800">{user.plan.creditsLeft}</strong>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#3457ff] to-[#6b8cff]" style={{ width: `${creditPercent}%` }} />
                        </div>
                        <p className="mt-3 text-sm text-slate-500">{user.plan.creditsLeft} of {user.plan.dailyLimit} available today</p>
                    </div>
                </div>
            </section>

            <StatGrid>
                <StatCard label="Total Uploads" value={String(analyses.length)} icon={<FiUpload />} tone="blue" description="Charts submitted" />
                <StatCard label="Charts Analyzed" value={String(analyses.length)} icon={<FiBarChart2 />} tone="green" description="AI reads generated" />
                <StatCard label="AI Responses" value={String(aiResponses)} icon={<FiMessageSquare />} tone="purple" description="Chat replies received" />
                <StatCard label="Credits Left Today" value={`${user.plan.creditsLeft} / ${user.plan.dailyLimit}`} icon={<FiCreditCard />} tone="yellow" description={`${user.plan.name} plan`} />
            </StatGrid>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <WorkflowCard
                    done
                    title="Account created"
                    description="Your member dashboard, session, and private records are active."
                    href="/dashboard/profile"
                />
                <WorkflowCard
                    done={analyses.length > 0}
                    title="First chart uploaded"
                    description={analyses.length > 0 ? "Your analysis history is now building." : "Upload a chart image to generate your first result."}
                    href="/dashboard/upload"
                />
                <WorkflowCard
                    done={profileComplete}
                    title="Profile completed"
                    description={profileComplete ? "Your account details are complete." : "Add name, phone, country, gender, and age group for a complete profile."}
                    href="/dashboard/profile"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.1fr]">
                <Panel>
                    <div className="h-[220px] rounded-xl bg-gradient-to-tr from-[#3457ff] to-[#6b8cff] p-5 shadow-lg shadow-[#3457ff]/20">
                        <div className="flex h-full items-end gap-4 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:100%_45px]">
                            {bars.map((height, index) => (
                                <div key={`${height}-${index}`} className="flex h-full flex-1 items-end">
                                    <div className="w-full rounded-t-md bg-white/90" style={{ height: `${height}%` }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <h3 className="mt-6 text-lg font-bold text-slate-800">AI Analysis Summary</h3>
                    <p className="mt-0.5 text-sm text-slate-500">Summary of your uploaded chart actions</p>
                    <p className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-400">
                        <FiClock /> {analyses.length} analyses on record
                    </p>
                </Panel>

                <Panel className="px-0 pb-2">
                    <PanelHeader
                        className="px-6"
                        title="Recent Activity"
                        description="Your latest uploads and analyses"
                        action={<Link href="/dashboard/history" className="inline-flex items-center gap-1 text-sm font-medium text-[#3457ff] hover:underline">View all <FiArrowRight /></Link>}
                    />
                    <div className="mt-4">
                        {recent.length === 0 ? (
                            <div className="px-6 py-10 text-center">
                                <p className="font-medium text-slate-700">No chart reviews yet</p>
                                <p className="mt-1 text-sm text-slate-500">Your first upload will appear here with the AI trade score.</p>
                            </div>
                        ) : recent.map((item) => (
                            <Link key={item.id} href={`/dashboard/results?id=${item.id}`} className="flex items-center gap-4 border-t border-slate-100 px-6 py-3.5 transition-colors hover:bg-slate-50">
                                <IconTile tone={entryTone(item.entryType)} className="h-10 w-10 text-base"><FiBarChart2 /></IconTile>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-slate-800">{item.symbol} <span className="text-slate-400">· {item.timeframe}</span></p>
                                    <p className="truncate text-sm text-slate-500">{item.summary}</p>
                                </div>
                                <Badge tone={entryTone(item.entryType)}>{item.entryType}</Badge>
                            </Link>
                        ))}
                    </div>
                </Panel>
            </div>

            <Panel>
                <PanelHeader title="Quick Actions" description="Common tasks you might want to perform" />
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <QuickAction href="/dashboard/upload" icon={<FiUpload />} tone="blue" title="Upload Chart" description="Spend a credit and generate a new analysis." />
                    <QuickAction href="/dashboard/chat" icon={<FiMessageSquare />} tone="purple" title="Start Chat" description="Ask follow-up questions about saved setups." />
                    <QuickAction href="/dashboard/history" icon={<FiFileText />} tone="green" title="View History" description="Review every analysis tied to your account." />
                </div>
            </Panel>

            <Disclaimer />
        </div>
    );
};

const entryTone = (entryType: string): Tone => (entryType === "Buy" ? "green" : entryType === "Sell" ? "red" : "amber");

const WorkflowCard = ({ done, title, description, href }: { done: boolean; title: string; description: string; href: string }) => (
    <Link href={href} className="group flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <span className={clsx("grid h-10 w-10 shrink-0 place-items-center rounded-full", done ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
            <FiCheckCircle className="h-5 w-5" />
        </span>
        <div>
            <h3 className="font-bold text-slate-800 group-hover:text-[#3457ff]">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
    </Link>
);

const QuickAction = ({ href, icon, tone, title, description }: { href: string; icon: React.ReactNode; tone: Tone; title: string; description: string }) => (
    <Link href={href} className="group rounded-xl border border-slate-200/80 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <IconTile tone={tone}>{icon}</IconTile>
        <h3 className="mt-4 font-bold text-slate-800 group-hover:text-[#3457ff]">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
    </Link>
);

export default DashboardPage;
