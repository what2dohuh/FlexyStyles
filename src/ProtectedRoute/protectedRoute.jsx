
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseconfig";
import { getUserRole } from "../services/authServices";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRole = await getUserRole(user.uid);
        setRole(userRole);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  
  if (!auth.currentUser || (requiredRole && role !== requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
