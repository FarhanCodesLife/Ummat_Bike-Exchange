"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image"; // For logo support
import logo from "@/public/dp.png"


export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/admin/login"); // Redirect if not logged in
      } else {
        setUser(u);
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between gap-2">
          
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image
                src={logo.src} // Add your logo in public folder
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-black">
                Used Bike Management App
              </h1>
              <p className="text-sm text-blue-800">Admin Panel</p>
            </div>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
