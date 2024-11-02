'use client'
import Link from "next/link";
import Sidebar from "./Sidebar";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: "", email: "" });
  const dropdownRef = useRef(null);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
            const decodedToken = jwtDecode(token);
            const user = { 
              name: decodedToken.username, 
              email: decodedToken.email
            };
            setUserData(user);
            setIsLoggedIn(true);
          } catch (error) {
            console.error('Token decoding failed:', error);
            setIsLoggedIn(false);
          }
    } else {
      window.location.href = "/Login";
      setIsLoggedIn(false);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    window.location.href = "/Login";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 shadow-sm p-4 flex justify-between items-center z-40 bg-blue-300">
      <div>
        <Sidebar />
      </div>
      <div>
        <h1 className="text-3xl font-serif text-blue-900">API Security Shield</h1>
      </div>
      <div className="relative flex items-center">
        {isLoggedIn && (
          <>
            <div>
              <Image
                src="/user.svg"
                width={40}
                height={40}
                alt="User Profile"
                onClick={toggleDropdown}
                className="cursor-pointer"
              />
            </div>

            {dropdownOpen && (
              <div ref={dropdownRef} className="absolute right-0 top-16 w-48 bg-white shadow-lg rounded-lg z-50">
                <div className="p-4 text-gray-700 flex flex-col justify-center items-center">
                  <h3 className="font-semibold">{userData.name}</h3>
                  <p className="text-sm">{userData.email}</p>
                </div>
                <div className="border-t border-gray-300"></div>
                <div className="flex flex-col justify-center items-center">
                  <Link href="/Profile">
                    <button className="text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                  </Link>
                  <button className="text-left px-4 py-2 hover:bg-gray-100" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;