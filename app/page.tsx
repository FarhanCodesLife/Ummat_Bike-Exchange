"use client";

import Layout from "../components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { PlusCircle, Bike, ShoppingCart } from "lucide-react";

interface BikeType {
  id: string;
  registrationNumber?: string;
  sellerName?: string;
  sellerCNIC?: string;
  backPhoto?: string;
  frontPhoto?: string;
  buyerName?: string;
  salePrice?: number;
  chassisNumber?: string;
  repairCost?: number;
  modelYear?:string;
  maker?:string;
  repairDescription?: string;
}

export default function Home() {
  const [readyBikes, setReadyBikes] = useState<BikeType[]>([]);
const [allBikesCount, setAllBikesCount] = useState(0);

useEffect(() => {
  const getReadyBikes = async () => {
    const snap = await getDocs(collection(db, "bikes"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BikeType[];
    setAllBikesCount(list.length);

      // Ready to Sell: Part1 complete but not sold yet
      const readyToSell = list.filter(
        (b) =>
          b.registrationNumber &&
          b.sellerName &&
          !b.buyerName &&
          !b.salePrice
      );

      setReadyBikes(readyToSell);
    };

    getReadyBikes();
  }, []);

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Add New Bike */}
        <Link href="/bike/add" className="group">
          <div className="p-6 bg-blue-600 text-white rounded-xl shadow-lg group-hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <PlusCircle size={28} />
              </div>
              <div>
                <p className="text-xl font-semibold">Add New Bike</p>
                <p className="text-sm opacity-80">Enter a fresh bike record</p>
              </div>
            </div>
          </div>
        </Link>

        {/* View All Bikes */}
        <Link href="/bike" className="group">
          <div className="p-6 bg-green-600 text-white rounded-xl shadow-lg group-hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Bike size={28} />
              </div>
              <div>
                <p className="text-xl font-semibold">View Bikes </p>
                {/* <p className="text-sm opacity-80">Manage all bike records</p> */}
                        <p className="text-3xl font-bold mt-1">{allBikesCount}</p>

              </div>
            </div>
          </div>
        </Link>

        {/* Ready to Sell Bikes */}
        <div className="p-6 bg-purple-600 text-white rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <ShoppingCart size={28} />
            </div>
            <div>
              <p className="text-xl font-semibold">Ready to Sell</p>
              <p className="text-3xl font-bold mt-1">{readyBikes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* READY TO SELL BIKES GRID */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4 text-gray-700">
          Bikes Ready for Selling
        </h3>

        {readyBikes.length === 0 ? (
          <p className="text-gray-500">No bikes are ready for selling.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {readyBikes.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-xl shadow-lg border p-4 hover:shadow-2xl transition relative group"
              >
                {/* Ribbon */}
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-2 py-1 rounded-bl-lg font-bold">
                  Ready to Sell
                </div>

                {/* Bike Image */}
                {bike.frontPhoto ? (
                  <img
                    src={bike.frontPhoto}
                    className="w-full h-56 object-cover rounded-lg mb-3 transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                
                {/* Bike Info */}
                <p className="text-lg font-bold">{bike.registrationNumber || "No Reg"}</p>
                <p className="text-lg font-bold">{bike.maker || "No Reg"}</p>
                <p className="text-lg font-bold">{bike.modelYear || "No Reg"}</p>
                <p className="text-gray-600 text-sm">Seller: {bike.sellerName}</p>
                <p className="text-gray-500 text-xs mt-1">Chassis: {bike.chassisNumber || "-"}</p>
                {bike.repairCost && (
                  <p className="text-purple-600 font-semibold mt-1">
                    Repair Cost: ${bike.repairCost}
                  </p>
                )}

                {/* View Button */}
                <Link
                  href={`/singlebike/${bike.id}`}
                  className="block mt-4 bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
