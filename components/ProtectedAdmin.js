"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProtectedAdmin({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = auth.currentUser;

      if (!user) return router.push("/admin/login");

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists() && userDoc.data().role === "admin") {
        setAllowed(true);
      } else {
        router.push("/admin/login");
      }
    };

    checkUser();
  }, []);

  if (!allowed) return <div>Loading...</div>;

  return children;
}
