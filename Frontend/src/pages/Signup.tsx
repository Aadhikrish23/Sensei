import React, { useEffect, useState } from "react";
import auth from "../api/auth";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verifylink, setVerifylink] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [show, setShow] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const {accessToken} = useAuth();
  const navigate = useNavigate();
  const showpassword = () => {
    setShow(!show);
  };
  const showConfirmpassword = () => {
    setShowConfirm(!showConfirm);
  };
  const submithandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!email.trim()) {
        throw new Error("Invalid email");
      }
      if (!password.trim()) {
        throw new Error("Invalid password");
      }
      if (!confirmpassword.trim()) {
        throw new Error("Confirm password is required");
      }
      if (password !== confirmpassword) {
        throw new Error("Passwords do not match");
      }

      const userdata = await auth.userSignup(email, password);
      setSuccess(userdata.Status);
      setVerifylink(userdata.Data.verificationLink);

      console.log("loginsuccess");
    } catch (error: any) {
      const errormsg =
        error instanceof Error ? error.message : error.toString();
      setError(errormsg);
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
    <div
      className="min-h-screen flex items-center justify-center 
                  bg-samurai-bg dark:bg-ninja-bg 
                  transition-colors duration-300"
    >
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 flex items-center gap-2
             px-4 py-2 rounded-full
             bg-samurai-card dark:bg-ninja-card
             border border-samurai-border dark:border-ninja-border
             shadow-md
             hover:scale-105 transition-all duration-300"
      >
        <span className="text-lg">{theme === "light" ? "🌙" : "☀️"}</span>
      </button>

      <div
        className=" w-[90%] sm:w-[400px] md:w-[450px] 
                    bg-samurai-card dark:bg-ninja-card 
                    p-8 rounded-2xl
                    shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
      >
        <h1
          className="text-3xl font-bold text-center mb-8 
                     text-samurai-text dark:text-ninja-text"
        >
          SignUp
        </h1>

        <form onSubmit={submithandler} className="space-y-5">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full px-4 py-3 rounded-lg border
                     border-samurai-border dark:border-ninja-border
                     bg-transparent
                     text-samurai-text dark:text-ninja-text
                     placeholder:text-samurai-muted dark:placeholder:text-ninja-muted
                     focus:outline-none focus:ring-2
                     focus:ring-samurai-accent dark:focus:ring-ninja-accent
                     transition"
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
              onClick={() => showpassword()}
              className="ml-2 text-lg"
            >
              {show ? "🫣" : "😌"}
            </button>
          </div>

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
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="flex-1 bg-transparent outline-none placeholder:text-samurai-muted dark:placeholder:text-ninja-muted"
            />
            <button
              type="button"
              onClick={showConfirmpassword}
              className="ml-2 text-lg"
            >
              {showConfirm ? "🫣" : "😌"}
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <div
            className="text-sm text-center mt-4 
                        text-samurai-text dark:text-ninja-text"
          >
            Existing user?{" "}
            <span
              className="text-center text-sm font-bold 
                       text-samurai-primary dark:text-ninja-accent 
                       hover:underline"
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {loading && (
            <p className="text-sm text-center text-samurai-muted dark:text-ninja-muted">
              Loading...
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 text-center">{success}</p>
          )}

          {verifylink && (
            <a className="text-sm text-center block underline">{verifylink}</a>
          )}
        </form>
      </div>
    </div>
  );
}

export default Signup;
