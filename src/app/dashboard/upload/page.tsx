import UploadChartForm from "@/components/dashboard/UploadChartForm";
import { requireUser } from "@/lib/server/auth";
import { isPlanExpired } from "@/lib/server/store";

const UploadPage = async () => {
    const user = await requireUser();
    const expired = isPlanExpired(user);

    return <UploadChartForm plan={user.plan} expired={expired} />;
};

export default UploadPage;
