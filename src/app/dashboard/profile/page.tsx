import { requireUser } from "@/lib/server/auth";
import { publicUser } from "@/lib/server/store";
import ProfileForm from "@/components/dashboard/ProfileForm";

const ProfilePage = async () => {
    const user = await requireUser();

    return (
        <div className="mx-auto max-w-[1100px]">
            <ProfileForm user={publicUser(user)} />
        </div>
    );
};

export default ProfilePage;
