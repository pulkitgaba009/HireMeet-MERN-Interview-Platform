import { Navigate, Route, Routes } from "react-router";
import { useUser } from "@clerk/clerk-react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import { Toaster } from "react-hot-toast";

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
          element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
