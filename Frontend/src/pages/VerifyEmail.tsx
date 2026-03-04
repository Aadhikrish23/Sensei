import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import auth from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const [searchpaams] = useSearchParams();
  const token = searchpaams.get("token");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { verify } = useAuth();
  const navigate = useNavigate();
  const hasVerified = useRef(false);
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!token) {
          throw new Error("Invalid verification link ");
        }
        if (hasVerified.current) return;

        hasVerified.current = true;
        await verify(token);
        setSuccess("Verified successfully");
      } catch (error: any) {
        const errormsg =
          error instanceof Error ? error.message : error.toString();
        setError(errormsg);
      } finally {
        setLoading(false);
      }
    };
    verifyEmail();
  }, [token]);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [accessToken]);

  return (
    <div>
      {error && <p>{error}</p>}
      {loading && <p>loading...</p>}
      {success && <p>{success}</p>}
    </div>
  );
}
