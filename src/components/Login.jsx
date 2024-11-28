import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        // LOGIN
        setLoading(true);
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password
        });
        if (data?.success) {
          console.log("login successful");
          setToken(data?.token);
          setUser(data?.user);
          localStorage.setItem("iToken", data?.token);
          setShowLogin(false);
        } else {
          console.log("could not login");
          toast.error(data?.message);
        }
      } else {
        // REGISTER
        setLoading(true);
        console.log("Register");
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password
        });
        if (data?.success) {
          console.log("Register successful");
          setToken(data?.token);
          setUser(data?.user);
          localStorage.setItem("iToken", data?.token);
          setShowLogin(false);
        } else {
          console.log("could not register");
          toast.error(data?.message);
        }
      }
    } catch (err) {
      console.log("Error in onSubmitHandler in Login.jsx : ", err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  // disable scrolling when the Login/Sign Up modal is opened
  useEffect(() => {
    // disable scrolling
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state !== "Login" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <img
              src={assets.profile_icon}
              className="w-6"
              alt="profile_icon1"
            />
            <input
              type="text"
              className="outline-none text-sm"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              disabled={loading}
              required
            />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} className="w-8" alt="email_icon" />
          <input
            type="email"
            className="outline-none text-sm"
            placeholder="Email ID"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={loading}
            required
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} className="w-5" alt="lock_icon" />
          <input
            type="password"
            className="outline-none text-sm"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={loading}
            required
          />
        </div>
        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forgot password?
        </p>
        <button
          className="bg-blue-600 w-full text-white py-2 rounded-full"
          disabled={loading}
        >
          {state === "Login" && loading
            ? "Authenticating..."
            : state === "Login" && !loading
            ? "Login"
            : state === "Sign Up" && loading
            ? "Signing Up..."
            : "Create account"}
          {/* {state === "Sign Up" && loading ? "Signing Up..." : "Create account"} */}
        </button>
        {state === "Login" ? (
          <p className="mt-5 text-center">
            Do not have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-600 cursor-pointer"
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          className="absolute top-5 right-5 cursor-pointer"
          alt="cross_icon"
        />
      </motion.form>
    </div>
  );
}

export default Login;
