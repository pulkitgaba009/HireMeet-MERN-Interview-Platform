import { Navigate, Route, Routes } from "react-router";
import { useUser } from "@clerk/clerk-react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import AdminAuth from "./pages/AdminAuth";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";

function App() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />}
        />

        <Route
          path="/problems/:id"
          element={isSignedIn ? <ProblemPage /> : <Navigate to="/" />}
        />

         <Route
          path="/dashboard"
          element={isSignedIn?<Dashboard />:<Navigate to="/" />} 
        />

        <Route path="/admin" element={<AdminAuth/>}></Route>
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
