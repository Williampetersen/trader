import UploadChartForm from "@/components/dashboard/UploadChartForm";
import { requireUser } from "@/lib/server/auth";

const UploadPage = async () => {
    const user = await requireUser();
    const expired = new Date(user.plan.expiresAt).getTime() <= Date.now();

    return <UploadChartForm plan={user.plan} expired={expired} />;
};

export default UploadPage;
