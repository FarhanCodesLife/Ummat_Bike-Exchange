"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password)
      return setError("All fields are required.");

    setLoading(true);
    setError("");

    try {
      // Create User
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const uid = userCred.user.uid;

      // Save User in Firestore
      await setDoc(doc(db, "users", uid), {
        name: form.name,
        email: form.email,
        role: "editor",  // default role (can change)
        createdAt: new Date(),
      });

      router.push("/admin/login");
    } catch (err) {
      setError("Email already in use or invalid details.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-xl rounded-xl border">
        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Signup to access the system
        </p>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="border px-3 py-2 w-full rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            className="border px-3 py-2 w-full rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="border px-3 py-2 w-full rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          className="bg-blue-600 text-white w-full py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creating Account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-sm text-center mt-4">{error}</p>
        )}

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/admin/login" className="text-blue-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
