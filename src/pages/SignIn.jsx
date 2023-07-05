import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [testApi, setTestApi] = useState("Loading...");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" })
      .then((res) => res.json())
      .then((res) => res.isLoggedIn && navigate("/"));

    fetch(`${import.meta.env.VITE_API}`)
      .then((res) => res.json())
      .then((res) => setTestApi(res));
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API}/sign-in`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  return (
    <>
      <NavBar />
      <form>
        {testApi}
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" onClick={handleSignIn}>
          Sign In
        </button>
      </form>
    </>
  );
}

export default SignIn;
