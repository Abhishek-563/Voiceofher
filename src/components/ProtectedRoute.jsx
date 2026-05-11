import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)"
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--pink)",
          animation: "spin-slow 0.8s linear infinite"
        }} />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
