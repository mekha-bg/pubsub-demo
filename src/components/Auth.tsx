import { useState } from "react";
import {
  signUp,
  confirmSignUp,
  signIn,
  fetchAuthSession,
} from "aws-amplify/auth";

interface Props {
  onSuccess: (email: string, identityId: string) => void;
}

export default function Auth({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [authStep, setAuthStep] = useState<"signup" | "confirm" | "login">("login");

  const handleSignUp = async () => {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
        },
      });
      setAuthStep("confirm");
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmSignUp({ username: email, confirmationCode });
      setAuthStep("login");
    } catch (err) {
      console.error("Confirmation error:", err);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn({ username: email, password });
      const session = await fetchAuthSession();
      const identityId = session.identityId ?? "";
      onSuccess(email, identityId);
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>
        {authStep === "signup"
          ? "Create Account"
          : authStep === "confirm"
          ? "Confirm Sign Up"
          : "Login"}
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      {authStep !== "confirm" && (
        <>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br />
        </>
      )}

      {authStep === "signup" && (
        <button onClick={handleSignUp}>Sign Up</button>
      )}

      {authStep === "confirm" && (
        <>
          <input
            type="text"
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          /><br />
          <button onClick={handleConfirm}>Confirm Code</button>
        </>
      )}

      {authStep === "login" && (
        <button onClick={handleSignIn}>Login</button>
      )}

      <br /><br />

      {authStep !== "signup" && (
        <button onClick={() => setAuthStep("signup")}>Switch to Sign Up</button>
      )}
      {authStep !== "login" && (
        <button onClick={() => setAuthStep("login")}>Switch to Login</button>
      )}
    </div>
  );
}
