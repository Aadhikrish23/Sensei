import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  const [verifylink, setVerifylink] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login, accessToken } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const showpassword = () => {
    setShow(!show);
  };
  const submithandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
     

      if (!email.trim()) {
        throw new Error("Invalid email");
      }
      if (!password.trim()) {
        throw new Error("Invalid password");
      }

      const userdata = await login(email, password);
      if (userdata !== "SUCCESS") {
        toast.success("Verification mail has Sent")
      } else {
        setVerifylink(null);
        navigate("/dashboard");
        console.log("loginsuccess");
      }
    } catch (error: any) {
      const errormsg =
        error instanceof Error ? error.message : error.toString();
      toast.error(errormsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [accessToken,navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-samurai-bg dark:bg-ninja-bg transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 flex items-center gap-2
             px-4 py-2 rounded-full
             bg-samurai-card dark:bg-ninja-card
             border border-samurai-border dark:border-ninja-border
             shadow-md
             hover:scale-105 transition-all duration-300"
      >
        <span className="text-lg">{theme === "samurai" ? "🌙" : "☀️"}</span>
      </button>
      <div className=" w-[90%] sm:w-[400px] md:w-[450px] bg-samurai-card dark:bg-ninja-card p-8 rounded-2xl shadow-xl border border-samurai-border dark:border-ninja-border">
        <h1 className="text-3xl font-bold text-center mb-6 text-samurai-text dark:text-ninja-text">
          Login
        </h1>

        <form onSubmit={submithandler} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full px-4 py-3 rounded-lg border 
                     border-samurai-border dark:border-ninja-border
                     bg-transparent
                     text-samurai-text dark:text-ninja-text
                     placeholder:text-samurai-muted dark:placeholder:text-ninja-muted
                     focus:outline-none focus:ring-2
                     focus:ring-samurai-accent dark:focus:ring-ninja-accent"
          />

          <div
            className=" flex items-center w-full px-4 py-3 rounded-lg border 
                     border-samurai-border dark:border-ninja-border
                     bg-transparent
                     text-samurai-text dark:text-ninja-text
                     placeholder:text-samurai-muted dark:placeholder:text-ninja-muted
                     focus:outline-none focus:ring-2
                     focus:ring-samurai-accent dark:focus:ring-ninja-accent"
          >
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="flex-1 bg-transparent outline-none placeholder:text-samurai-muted dark:placeholder:text-ninja-muted"
            />
            <button
              type="button"
              onClick={showpassword}
              className="ml-2 text-lg"
            >
              {show ? "🫣" : "😌"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold
                     bg-samurai-primary hover:bg-samurai-primaryHover
                     dark:bg-ninja-primary dark:hover:bg-ninja-primaryHover
                     text-white transition duration-200
                     disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div className="text-sm font-bold text-center mb-6 text-samurai-text dark:text-ninja-text">
            New to Sensei{" "}
            <span
              className="text-center text-sm 
                       text-samurai-primary dark:text-ninja-accent 
                       hover:underline"
              onClick={() => navigate("/signup")}
            >
              Create User...
            </span>
          </div>

        

         
        </form>
      </div>
    </div>
  );
}
