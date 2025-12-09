"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function BikeDashboard() {
  const [bikes, setBikes] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // tabs: all / sale / repair / details

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
      bike.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
      bike.buyerName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBikes(filtered);
  }, [search, bikes]);

  const tabs = [
    { label: "All Bikes", value: "all" },
    { label: "Sale Info", value: "sale" },
    { label: "Repair Info", value: "repair" },
    { label: "Bike Details", value: "details" },
  ];

  const renderImages = (bike) => {
    const imgKeys = [
      "frontPhoto","backPhoto","leftPhoto","rightPhoto",
      "ownerCNIC","saleReceipt","salePhotos","repairBill"
    ];
    return imgKeys.map(key => bike[key] && (
      <img key={key} src={bike[key]} alt={key} className="h-20 w-20 object-cover rounded border"/>
    ));
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Bike Dashboard</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by registration, seller, owner, or buyer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
        <Link href="/bike/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Bike
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`py-2 px-4 font-semibold ${activeTab === tab.value ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bike Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBikes.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No bikes found.</div>
        )}

        {filteredBikes.map(bike => (
          <div key={bike.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
            <h3 className="font-bold text-lg mb-2">{bike.registrationNumber || "No Reg. No"}</h3>

            <div className="flex flex-wrap gap-2 mb-2">
              {renderImages(bike)}
            </div>

            {/* Conditional content */}
            {activeTab === "all" && (
              <div className="space-y-1">
                <p><strong>Bill No:</strong> {bike.billNumber || "-"}</p>
                <p><strong>Seller:</strong> {bike.sellerName || "-"}</p>
                <p><strong>Owner:</strong> {bike.ownerName || "-"}</p>
                <p><strong>Sale Price:</strong> {bike.salePrice || "-"}</p>
                <p><strong>Buyer:</strong> {bike.buyerName || "-"}</p>
                <p><strong>Repair Cost:</strong> {bike.repairCost || "-"}</p>
              </div>
            )}

            {activeTab === "sale" && (
              <div className="space-y-1">
                <p><strong>Buyer Name:</strong> {bike.buyerName || "-"}</p>
                <p><strong>Buyer CNIC:</strong> {bike.buyerCNIC || "-"}</p>
                <p><strong>Buyer Phone:</strong> {bike.buyerPhone || "-"}</p>
                <p><strong>Sale Date:</strong> {bike.saleDate || "-"}</p>
                <p><strong>Sale Price:</strong> {bike.salePrice || "-"}</p>
                <p><strong>Payment Method:</strong> {bike.paymentMethod || "-"}</p>
                <p><strong>File Status:</strong> {bike.fileHandoverStatus || "-"}</p>
                {bike.ownerCNIC && <img src={bike.ownerCNIC} alt="Owner CNIC" className="h-20 w-20 object-cover rounded border mt-2"/>}
              </div>
            )}

            {activeTab === "repair" && (
              <div className="space-y-1">
                <p><strong>Repair Description:</strong> {bike.repairDescription || "-"}</p>
                <p><strong>Cost:</strong> {bike.repairCost || "-"}</p>
                {bike.repairBill && <img src={bike.repairBill} alt="Repair Bill" className="h-20 w-20 object-cover rounded border mt-2"/>}
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-1">
                <p><strong>Chassis:</strong> {bike.chassisNumber || "-"}</p>
                <p><strong>Engine:</strong> {bike.engineNumber || "-"}</p>
                <p><strong>HP:</strong> {bike.hp || "-"}</p>
                <p><strong>Model:</strong> {bike.modelYear || "-"}</p>
                <p><strong>Color:</strong> {bike.color || "-"}</p>
                <p><strong>Maker:</strong> {bike.maker || "-"}</p>
              </div>
            )}

            <Link href={`/bike/${bike.id}`} className="mt-3 inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Edit / View
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}
