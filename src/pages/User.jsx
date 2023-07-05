import { Link } from "react-router-dom";

function User() {
  return (
    <>
      <h3>User</h3>
      <Link to={"/"}>
        <button>Home</button>
      </Link>
    </>
  );
}

export default User;
