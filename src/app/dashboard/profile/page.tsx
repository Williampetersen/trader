import { requireUser } from "@/lib/server/auth";
import { publicUser } from "@/lib/server/store";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { MutedText } from "@/components/dashboard/DashboardUi";

const ProfilePage = async () => {
    const user = await requireUser();

    return (
        <div className="mx-auto max-w-[1000px]">
            <div className="mb-8 text-center">
                <h2 className="text-4xl font-extrabold">My Profile</h2>
                <MutedText className="mt-3">Manage your account information and preferences</MutedText>
            </div>
            <ProfileForm user={publicUser(user)} />
        </div>
    );
};

export default ProfilePage;
