import { useEffect } from "react";
import NavBar from "../../components/NavBar";

function CreateOrder() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/`);
  }, []);

  return (
    <>
      <NavBar />
      <h3>Create Order</h3>
    </>
  );
}

export default CreateOrder;
