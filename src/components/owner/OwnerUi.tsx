import { Badge, MutedText, Panel, StatCard, type Tone } from "@/components/dashboard/DashboardUi";

export { Panel as OwnerPanel, MutedText as OwnerMuted, Badge as OwnerBadge };

export const OwnerStat = ({ label, value, detail, icon, tone = "blue" }: { label: string; value: string; detail?: string; icon: React.ReactNode; tone?: Tone }) => (
    <StatCard label={label} value={value} description={detail} icon={icon} tone={tone} />
);

export const formatMoney = (value: number) => `$${value.toFixed(2)}`;

export const formatDate = (value?: string) => value ? new Date(value).toLocaleString() : "Never";
