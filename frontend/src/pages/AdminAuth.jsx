import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/axios"; 

function AdminAuth() {
  const [password, setPassword] = useState("");
  const [adminName, setAdminName] = useState(""); 
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth", {
        password,
        adminName,
      });

      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        navigate("/adminPannel");
      }
    } catch (err) {
      toast.error("Invalid password");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral to-black text-base-content flex justify-center items-center">
      <form
        onSubmit={handleForm}
        className="card w-100 h-70 border border-primary/5 backdrop-blur-xl flex flex-col justify-evenly items-center p-6"
      >
        <h1 className="text-2xl card-title">Admin Authentication</h1>

        <input
          type="text"
          placeholder="admin name"
          className="input w-full"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          className="input w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl w-[80%] py-5"
        >
          Authenticate
        </button>
      </form>
    </div>
  );
}

export default AdminAuth;