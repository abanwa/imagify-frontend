import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("iToken") ? localStorage.getItem("iToken") : ""
  );
  const [credit, setCredit] = useState(false);

  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const loadCreditsData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { token }
      });

      if (data?.success) {
        console.log("credit fetched successful");
        setCredit(data?.credits);
        setUser(data?.user);
      } else {
        console.log("could not fetch credit");
      }
    } catch (err) {
      console.log("Error in loadCreditsData in AppContext : ", err);
      toast.error(err?.message);
    }
  }, [backendUrl, token]);

  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        {
          headers: { token }
        }
      );

      if (data?.success) {
        console.log("image generated successful");
        await loadCreditsData();

        return data?.resultImage;
      } else {
        console.log("could not generate image");
        toast.error(data?.message);
        await loadCreditsData();
        if (data?.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (err) {
      console.log("Error in generateImage in AppContext : ", err);
      toast.error(err?.message);
    }
  };

  const logout = () => {
    token && localStorage.removeItem("iToken");
    token && setToken("");
    setUser(null);
  };

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [loadCreditsData, token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
