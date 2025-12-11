"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password)
      return setError("Please fill in all fields.");

    setLoading(true);
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const uid = userCred.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        setError("User record not found.");
        setLoading(false);
        return;
      }

      if (userDoc.data().role !== "admin") {
        setError("Access denied: You are not an Admin.");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err) {
      setError("Incorrect email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-xl rounded-xl border">

        <h1 className="text-2xl font-bold text-center mb-2">Admin Panel</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Sign in to access the dashboard
        </p>

        <div className="mb-4">
          <label className="text-sm font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="admin@example.com"
            className="border px-3 py-2 w-full rounded mt-1 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

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

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {error && (
          <p className="text-red-600 text-sm text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
