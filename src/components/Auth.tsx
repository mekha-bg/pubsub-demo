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

import { IoTClient, AttachPolicyCommand } from "@aws-sdk/client-iot"; // ES Modules import

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
      const policyName = "PubSubPolicy";
      const credentials = session.credentials;
      attachPolicy(identityId, policyName, credentials);
      onSuccess(email, identityId);
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  async function attachPolicy(id: string, policyName: string, credentials) {
    console.log("Attach IoT Policy: " + policyName + " with cognito identity id: " + id);
    const client = new IoTClient({region: 'ap-southeast-1', credentials: credentials}); // IoTClient(iot_config)

    const input = { // AttachPolicyRequest
      policyName: policyName, // required
      target: id, // required
    };
    try {
      const command = new AttachPolicyCommand(input);
      const response = await client.send(command);
      console.log(response);
    }
    catch (err) {
      console.log(err);
    }
  }

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
