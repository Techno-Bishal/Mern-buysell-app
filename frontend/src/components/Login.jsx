import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/user/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" }, // Ensure correct format
        }
      );

      console.log("Login successful:", response.data);
      toast.success(response.data.message);

      // Store token properly in localStorage
      localStorage.setItem("user", JSON.stringify({ token: response.data.token }));

      // Reload page to apply login state everywhere
     

      // Redirect to homepage
      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed!";
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/logo.webp" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
          <h1 className="text-lg sm:text-2xl text-orange-500 font-bold">CourseHeaven</h1>
        </div>
        <div className="space-x-2 sm:space-x-4">
          <Link to="/signup" className="bg-green-500 text-white py-1 sm:py-2 px-3 sm:px-4 border border-white rounded">
            Signup
          </Link>
          <Link to="/login" className="bg-green-500 text-white py-1 sm:py-2 px-3 sm:px-4 border border-white rounded">
            Join Now
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="bg-gray-100 mx-auto p-8 rounded-lg shadow-lg w-full max-w-md sm:w-[500px] mt-20">
        <h2 className="text-2xl font-bold mb-4 text-center">CourseHeaven</h2>
        <p className="text-center text-gray-400 mb-6">Login to access paid courses</p>

        <form onSubmit={handleSubmit}>
          <div className="text-gray-400 mb-4">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email"
              required
              className="w-full p-3 text-black rounded-md bg-gray-300 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-gray-400 mb-4">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="**********"
                required
                className="w-full p-3 text-black rounded-md bg-gray-300 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-3 text-gray-500 cursor-pointer">👁️</span>
            </div>
          </div>

          {errorMessage && <div className="mb-4 text-red-500 text-center">{errorMessage}</div>}

          <button className="w-full cursor-pointer bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition">
            Login
          </button>
        </form>
      </div>

      {/* Footer Section */}
      <footer className="my-6 mx-auto sm:my-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CourseHeaven Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center cursor-pointer space-x-2">
              <img src="/logo.webp" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
              <h1 className="text-lg sm:text-2xl text-orange-500 font-bold">CourseHeaven</h1>
            </div>
            <div className="mt-3 text-center md:text-left">
              <p className="mb-2 text-black">Follow us</p>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#">
                  <FaFacebook className="text-blue-600 text-xl sm:text-2xl" />
                </a>
                <a href="#">
                  <FaInstagram className="text-pink-600 text-xl sm:text-2xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Social & Contact Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Connects</h3>
            <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
              <li className="hover:text-white cursor-pointer duration-300">Facebook: Bishal Course</li>
              <li className="hover:text-white cursor-pointer duration-300">Telegram: Bishal Course</li>
              <li className="hover:text-white cursor-pointer duration-300">Github: Bishal Course</li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Copyrights &#169; 2025</h3>
            <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
              <li className="hover:text-white cursor-pointer duration-300">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer duration-300">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer duration-300">Refund & Cancellation</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
