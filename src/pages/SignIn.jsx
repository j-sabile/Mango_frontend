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
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <NavBar />
      <section className="d-flex flex-column justify-content-center flex-fill px-3" style={{ background: "radial-gradient(circle, rgba(252,250,238,1) 35%, rgba(240,229,168,1) 100%)" }}>
        <div className="card d-flex flex-column py-5 px-3 p-sm-5 border-0 rounded-5 gap-4 m-4 align-self-center" style={{ width: "100%", maxWidth: "450px", boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)" }}>
          <img src="mango_icon.png" className="align-self-center" alt="mango icon" height="150px" width="150px" />
          <form className="d-flex flex-column gap-2">
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="btn-1 py-2 rounded-pill w-100 my-3 fw-semibold" onClick={handleSignIn} style={{ fontWeight: "500", fontSize: "14pt", letterSpacing: "0.2px" }}>
              SIGN IN
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
    </div>
  );
}

export default SignIn;
