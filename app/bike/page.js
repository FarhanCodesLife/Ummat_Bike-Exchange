  "use client";
  import { useState, useEffect } from "react";
  import Link from "next/link";
  import Layout from "../../components/Layout";
  import { db } from "../../lib/firebase";
  import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

  export default function BikeDashboard() {
    const [bikes, setBikes] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const router = useRouter();

    useEffect(() => {
      const fetchBikes = async () => {
        const snap = await getDocs(collection(db, "bikes"));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBikes(data);
        setFiltered(data);
      };
      fetchBikes();
    }, []);

    const deleteBike = async (id) => {
      if (!confirm("Are you sure you want to delete this bike?")) return;

      await deleteDoc(doc(db, "bikes", id));

      setBikes(prev => prev.filter(b => b.id !== id));
      setFiltered(prev => prev.filter(b => b.id !== id));
    };

    const statusCheck = (bike) => ({
      part1: bike.registrationNumber && bike.sellerName,
      part2: bike.repairDescription && bike.repairCost,
      part3: bike.buyerName && bike.salePrice
    });

    const applyFilters = () => {
      let list = [...bikes];

      const s = (b) => statusCheck(b);

      if (activeFilter === "purchased")
        list = list.filter(b => s(b).part1 &&   b.registrationNumber &&
          b.sellerName &&
          !b.buyerName &&
          !b.salePrice);

      if (activeFilter === "repair")
        list = list.filter(b => s(b).part2);

      if (activeFilter === "sold")
        list = list.filter(b => s(b).part3);

      if (activeFilter === "complete")
        list = list.filter(b => s(b).part1 && s(b).part2 && s(b).part3);

      if (search)
        list = list.filter(b =>
          b.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
          b.sellerName?.toLowerCase().includes(search.toLowerCase()) ||
          b.buyerName?.toLowerCase().includes(search.toLowerCase()) ||
          b.accountNumber?.toLowerCase().includes(search.toLowerCase()) ||
          b.buyerCNIC?.toLowerCase().includes(search.toLowerCase()) ||
          b.sellerCNIC?.toLowerCase().includes(search.toLowerCase()) ||
          b.accountNumber?.toLowerCase().includes(search.toLowerCase()) ||
          b.chassisNumber?.toLowerCase().includes(search.toLowerCase())
        );

      setFiltered(list);
    };

    useEffect(applyFilters, [search, activeFilter, bikes]);

    const filters = [
      { label: "All Bikes", value: "all" },
      { label: "Only Purchased", value: "purchased" },
      { label: "Repair", value: "repair" },
      { label: "Sold", value: "sold" },
      { label: "Complete Bikes", value: "complete" },
    ];

    const imgKeys = ["sellerwithbikephoto", "buyerWithBikePhoto"];

    return (
      <Layout>
         <button
        onClick={() => router.push("/")}
        className="mb-5 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
      >
        ← Home
      </button>
        <h2 className="text-3xl font-bold mb-4">All Bike Dashboard</h2>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
          <input
            className="border p-2 rounded w-full max-w-md"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link
            href="/bike/add"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-3 sm:mt-0"
          >
            Add New Bike
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 border-b pb-2">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-2 rounded font-semibold ${
                activeFilter === f.value ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-left text-sm">
              <tr>
                <th className="p-3">Reg. Number</th>
                <th className="p-3">Seller Image</th>
                <th className="p-3">Buyer Image</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-5 text-gray-500">
                    No bikes found.
                  </td>
                </tr>
              )}

            {filtered.map((bike) => {
    const s = statusCheck(bike);

    return (
      <tr key={bike.id} className="border-b hover:bg-gray-50">
        <td className="p-3 font-semibold">
          {bike.registrationNumber || "-"}
        </td>

        {/* Seller Image */}
        <td className="p-3">
          {bike.sellerwithbikephoto ? (
            <img
              src={bike.sellerwithbikephoto}
              className="h-14 w-14 rounded object-cover border"
            />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </td>

        {/* Buyer Image */}
        <td className="p-3">
          {bike.buyerWithBikePhoto ? (
            <img
              src={bike.buyerWithBikePhoto}
              className="h-14 w-14 rounded object-cover border"
            />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </td>

        <td className="p-3">
          <p>{bike.sellerName || "-"}</p>
          <p className="text-xs text-gray-500">{bike.sellerCNIC || ""}</p>
        </td>

        <td className="p-3">
          <p>{bike.buyerName || "-"}</p>
          <p className="text-xs text-gray-500">{bike.buyerCNIC || ""}</p>
        </td>

        <td className="p-3">
          <div className="flex gap-1">
            <span className={`px-2 py-1 rounded text-xs ${s.part1 ? "bg-green-200" : "bg-red-200"}`}>P</span>
            <span className={`px-2 py-1 rounded text-xs ${s.part2 ? "bg-green-200" : "bg-red-200"}`}>R</span>
            <span className={`px-2 py-1 rounded text-xs ${s.part3 ? "bg-green-200" : "bg-red-200"}`}>S</span>
          </div>
        </td>

        <td className="p-3 text-center flex gap-2 justify-center">
          <Link
            href={`/singlebike/${bike.id}`}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            View
          </Link>

          <Link
            href={`/bike/${bike.id}`}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </Link>

          <button
            onClick={() => deleteBike(bike.id)}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  })}
            </tbody>
          </table>
        </div>
      </Layout>
    );
  }
