import { useAuth } from "../context/AuthContext";
import ProfileInfo from "../components/ProfileInfo";
import SecuritySettings from "../components/SecuritySettings";
import PurchaseHistory from "../components/PurchaseHistory";
import Wishlist from "../components/Wishlist";

const Profile = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!user) {
        return <h2>Please log in to access your profile.</h2>;
    }

    return (
        <div className="profile-container">
            <ProfileInfo user={user} />
            <SecuritySettings user={user} />
            <PurchaseHistory user={user} />
            <Wishlist user={user} />
        </div>
    );
};

export default Profile;
