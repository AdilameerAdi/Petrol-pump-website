import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(username, password);
    
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left side - Design */}
      <div className="w-1/2 bg-gradient-to-b from-orange-500 to-yellow-400 relative hidden md:flex items-center justify-center overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-white rounded-full opacity-10"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white rounded-full opacity-10"></div>

        <div className="text-center px-8 relative z-10">
          <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-orange-500 text-3xl font-bold">⛽</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to  Mantri Petrol Pump</h1>
          <p className="text-white text-lg">
            Efficient and reliable petrol station management dashboard.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl w-96 p-10 m-4">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-md">
              <span className="text-white text-2xl font-bold">⛽</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-500 mt-1 text-center text-sm">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form className="flex flex-col" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
            />
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-orange-600 transition transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
