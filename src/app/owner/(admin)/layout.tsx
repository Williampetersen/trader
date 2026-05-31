import OwnerShell from "@/components/owner/OwnerShell";
import { requireOwner } from "@/lib/server/owner-auth";

export default async function OwnerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const owner = await requireOwner();
    return <OwnerShell ownerEmail={owner.email}>{children}</OwnerShell>;
}
