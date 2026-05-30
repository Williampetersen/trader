import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/server/auth";
import { publicUser } from "@/lib/server/store";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await requireUser();
    return <DashboardShell user={publicUser(user)}>{children}</DashboardShell>;
}
