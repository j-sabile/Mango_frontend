import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";

function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const init = async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/is-logged-in`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.isLoggedIn) navigate("/");
      else setLoading(false);
    };
    init();
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

  if (loading) return;

  return (
    <>
      <NavBar />
      <section className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="d-flex flex-column gap-5" style={{ width: "500px" }}>
          <img src="mango_icon.png" className="align-self-center" alt="mango icon" height="150px" width="150px" />
          <form className="d-flex flex-column gap-2">
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="btn w-100 mt-4" onClick={handleSignIn} style={{ backgroundColor: "#FFD60A", color: "#001D3D", fontWeight: "500", fontSize: "14pt" }}>
              Sign In
            </button>
            <a className="align-self-end" href="#">
              Forgot Password
            </a>
          </form>
          <p>
            Don't have an account?
            <a href="/create-account">Sign up</a>
          </p>
        </div>
      </section>
    </>
  );
}

export default SignIn;
