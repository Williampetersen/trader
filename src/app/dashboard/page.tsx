import Link from "next/link";
import { FiBarChart2, FiCheckCircle, FiCreditCard, FiFileText, FiMessageSquare, FiTarget, FiUpload } from "react-icons/fi";
import { requireUser } from "@/lib/server/auth";
import { readDb } from "@/lib/server/store";
import { Disclaimer, MutedText, Panel, StatCard } from "@/components/dashboard/DashboardUi";

const DashboardPage = async () => {
    const user = await requireUser();
    const db = await readDb();
    const analyses = db.analyses.filter((item) => item.userId === user.id);
    const aiResponses = db.chats.filter((item) => item.userId === user.id && item.role === "assistant").length;
    const recent = analyses.slice(-3).reverse();
    const bars = [1, 2, 3, 4, 5, 6].map((_, index) => (analyses.length ? 25 + ((analyses.length + index * 13) % 70) : 8));
    const profileComplete = Boolean(user.name && user.profile.mobile && user.profile.country && user.profile.gender && user.profile.ageGroup);

    return (
        <div className="space-y-7">
            <section className="overflow-hidden rounded-[2rem] border border-[#20242d] bg-[#111318] text-white shadow-[0_24px_60px_rgba(17,19,24,0.18)]">
                <div className="grid gap-6 bg-[linear-gradient(135deg,rgba(52,87,255,0.18),transparent_42%),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px] p-7 lg:grid-cols-[1fr_380px]">
                    <div>
                        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#f4c430]">Today&apos;s review desk</p>
                        <h2 className="mt-3 text-4xl font-extrabold">Welcome back, {user.name}</h2>
                        <p className="mt-3 max-w-2xl text-[#cbd5e1]">Upload chart screenshots, get a structured AI read, and keep your trade review process organized in one workspace.</p>
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                            <Link href="/dashboard/upload" className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#3457ff] px-6 py-3 font-extrabold text-white shadow-[0_16px_30px_rgba(52,87,255,0.28)] transition-colors hover:bg-[#263fd2]">
                                Upload chart
                                <FiUpload />
                            </Link>
                            <Link href={recent[0] ? `/dashboard/results?id=${recent[0].id}` : "/dashboard/history"} className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-extrabold text-white transition-colors hover:bg-white/15">
                                Review latest
                                <FiTarget />
                            </Link>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                        <p className="text-sm font-bold text-[#cbd5e1]">{user.plan.name} usage</p>
                        <div className="mt-4 flex items-end justify-between">
                            <strong className="text-5xl">{user.plan.creditsLeft}</strong>
                            <span className="rounded-full bg-[#f4c430] px-3 py-1 text-sm font-bold text-[#111318]">credits left</span>
                        </div>
                        <div className="mt-5 h-2 rounded-full bg-white/15">
                            <div className="h-2 rounded-full bg-[#f4c430]" style={{ width: `${user.plan.creditsLeft === 0 ? 0 : Math.max(6, (user.plan.creditsLeft / user.plan.dailyLimit) * 100)}%` }} />
                        </div>
                        <p className="mt-3 text-sm text-[#cbd5e1]">{user.plan.creditsLeft} of {user.plan.dailyLimit} available today</p>
                    </div>
                </div>
            </section>

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Total Uploads" value={String(analyses.length)} icon={<FiUpload />} tone="blue" />
                <StatCard label="Charts Analyzed" value={String(analyses.length)} icon={<FiBarChart2 />} tone="green" />
                <StatCard label="AI Responses" value={String(aiResponses)} icon={<FiMessageSquare />} tone="purple" />
                <StatCard label="Today Credits Left" value={`${user.plan.creditsLeft} / ${user.plan.dailyLimit}`} icon={<FiCreditCard />} tone="yellow" />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Panel className="min-h-[350px]">
                    <h3 className="flex items-center gap-2 font-extrabold"><FiBarChart2 /> AI Analysis Summary</h3>
                    <MutedText className="mt-2 text-sm">Summary of your uploaded chart actions</MutedText>
                    <div className="mt-8 h-[220px] rounded-3xl border border-white/10 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:46px_46px] p-5">
                        <div className="flex h-full items-end gap-5">
                            {bars.map((height, index) => (
                                <div key={`${height}-${index}`} className="flex flex-1 items-end rounded-t-xl bg-white/[0.06]">
                                    <div className="w-full rounded-t-xl bg-[#3457ff]" style={{ height: `${height}%` }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </Panel>

                <Panel className="min-h-[350px]">
                    <h3 className="flex items-center gap-2 font-extrabold">Recent Activity</h3>
                    <MutedText className="mt-2 text-sm">Your latest uploads and analyses</MutedText>
                    <div className="mt-8 space-y-3">
                        {recent.length === 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <strong>No chart reviews yet</strong>
                                <MutedText className="mt-1 text-sm">Your first upload will appear here with the AI trade score.</MutedText>
                            </div>
                        ) : recent.map((item) => (
                            <Link key={item.id} href={`/dashboard/results?id=${item.id}`} className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-[#3457ff]/70 hover:bg-white/[0.07]">
                                <strong>{item.symbol} - {item.timeframe}</strong>
                                <MutedText className="mt-1 text-sm">{item.summary}</MutedText>
                            </Link>
                        ))}
                    </div>
                    <Link href="/dashboard/history" className="mt-5 flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:border-[#3457ff]/70 hover:bg-white/[0.08]">
                        View All History
                    </Link>
                </Panel>
            </div>

            <Panel>
                <h3 className="font-extrabold">Quick Actions</h3>
                <MutedText className="mt-1 text-sm">Common tasks you might want to perform</MutedText>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <QuickAction href="/dashboard/upload" icon={<FiUpload />} title="Upload Chart" description="Spend a credit and generate a new analysis." />
                    <QuickAction href="/dashboard/chat" icon={<FiMessageSquare />} title="Start Chat" description="Ask follow-up questions about saved setups." />
                    <QuickAction href="/dashboard/history" icon={<FiFileText />} title="View History" description="Review every analysis tied to your account." />
                </div>
            </Panel>

            <Disclaimer />
        </div>
    );
};

const WorkflowCard = ({ done, title, description, href }: { done: boolean; title: string; description: string; href: string }) => (
    <Link href={href} className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] transition-colors hover:border-[#3457ff]/70 hover:bg-white/[0.07]">
        <div className="flex items-start gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${done ? "bg-[#16a34a]/20 text-[#86efac]" : "bg-[#f4c430]/15 text-[#fcd34d]"}`}>
                <FiCheckCircle />
            </div>
            <div>
                <h3 className="font-extrabold group-hover:text-[#93c5fd]">{title}</h3>
                <p className="mt-1 text-sm text-[#94a3b8]">{description}</p>
            </div>
        </div>
    </Link>
);

const QuickAction = ({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) => (
    <Link href={href} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-[#3457ff]/70 hover:bg-white/[0.07]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3457ff]/15 text-[#93c5fd]">{icon}</div>
        <h3 className="mt-4 font-extrabold">{title}</h3>
        <p className="mt-1 text-sm text-[#94a3b8]">{description}</p>
    </Link>
);

export default DashboardPage;
