import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const session = Cookies.get("session");
    if (session) {
      setIsAuthenticated(true);
      setUser({ username: session.split("-")[0] }); 
    } else {
      setIsAuthenticated(false);
      setUser(null);
      navigate("/admin/login");
    }
  }, [navigate, setUser]);

  return isAuthenticated ? element : null;
};

export default ProtectedRoute;