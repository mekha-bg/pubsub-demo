import { useEffect, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

import MessagePublisher from "./components/MessagePublisher";
import MessageSubscriber from "./components/MessageSubscriber";
import Auth from "./components/Auth";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [identityId, setIdentityId] = useState("");

  const handleAuthSuccess = async () => {
    try {
      const session = await fetchAuthSession();
      const id = session.identityId ?? "";
      //onSuccess(email, identityId);
      console.log("Cognito Identity ID:", id);
      setIdentityId(id);
      setIsSignedIn(true);
    } catch (err) {
      console.error("Failed to fetch identity ID:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsSignedIn(false);
      setIdentityId("");
    }
  };

return (
    <div style={{ padding: "1rem" }}>
      <h1>AWS Amplify PubSub Demo</h1>
      {!isSignedIn ? (
        <>
          <button onClick={handleAuthSuccess}>Log Out</button>
          <Auth onSuccess={handleAuthSuccess} />
        </>
      ) : (
        <>
          <p>
            <strong>Cognito Identity ID:</strong> {identityId}
          </p>
          <button onClick={handleLogout}>Logout</button>
          <hr />
          <MessagePublisher />
          <MessageSubscriber />
        </>
      )}
    </div>
  );
}

export default App;
