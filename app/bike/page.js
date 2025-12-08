"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function BikeList() {
  const [bikes, setBikes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBikes, setFilteredBikes] = useState([]);

  useEffect(() => {
    const fetchBikes = async () => {
      const snapshot = await getDocs(collection(db, "bikes"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBikes(data);
      setFilteredBikes(data);
    };
    fetchBikes();
  }, []);

  useEffect(() => {
    const filtered = bikes.filter(bike =>
      bike.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      bike.sellerName?.toLowerCase().includes(search.toLowerCase()) ||
      bike.ownerName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBikes(filtered);
  }, [search, bikes]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">All Bikes</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by registration, seller, or owner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
        <Link href="/bike/add" className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Bike
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Bill Number</th>
              <th className="px-4 py-2 border">Registration</th>
              <th className="px-4 py-2 border">Seller</th>
              <th className="px-4 py-2 border">Owner</th>
              <th className="px-4 py-2 border">Sale Price</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBikes.map(bike => (
              <tr key={bike.id} className="text-center">
                <td className="border px-2 py-1">{bike.billNumber}</td>
                <td className="border px-2 py-1">{bike.registrationNumber}</td>
                <td className="border px-2 py-1">{bike.sellerName}</td>
                <td className="border px-2 py-1">{bike.ownerName}</td>
                <td className="border px-2 py-1">{bike.salePrice || "-"}</td>
                <td className="border px-2 py-1">
                  <Link href={`/bike/${bike.id}`} className="text-blue-600 hover:underline">
                    Edit / View
                  </Link>
                </td>
              </tr>
            ))}
            {filteredBikes.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">No bikes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
