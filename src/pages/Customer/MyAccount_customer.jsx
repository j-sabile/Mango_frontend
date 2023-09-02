import { useEffect } from "react";
import NavBar from "../../components/NavBar";

function MyAccountCustomer() {
  useEffect(() => {
    const init = async () => {
      const res = await fetch(`${import.meta.env.VITE_API}/my-account`, { method: "GET", credentials: "include" });
      const data = await res.json();
      console.log(data);
    };
    init();
  }, []);

  return (
    <>
      <NavBar />
    </>
  );
}

export default MyAccountCustomer;
