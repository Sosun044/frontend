import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
const PrivateRoute = ({ children, allowedRoles }) => {
    const { token, user } = useAuth();

    const normalizeRole = (role) => {
        if (role === "ENVANTER_YONETIMI") return "ENVANTER";
        if (role === "IK") return "IK";
        return role;
    };

    // 🧠 Kullanıcı henüz decode edilmediyse bekle
    if (token && !user) {
        return <p className="p-4">Yükleniyor...</p>;
    }

    if (!token) {
        return <Navigate to="/sign-in" replace />;
    }

    const userRole = normalizeRole(user?.role);
    const hasAccess = allowedRoles.includes(userRole);

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};





export default PrivateRoute;
