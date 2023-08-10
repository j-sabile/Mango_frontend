import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" })
      .then((res) => res.json())
      .then((res) => res.isLoggedIn && navigate("/"));
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
      .then((res) => {
        console.log(res);
        if (res.success) navigate("/");
        else alert("Wrong Credentials");
      });
  };

  return (
    <>
      <NavBar />
      <form>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" onClick={handleSignIn}>
          Sign In
        </button>
      </form>
      <Link to="/create-account">Create Account</Link>
    </>
  );
}

export default SignIn;
