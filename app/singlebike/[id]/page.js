"use client";
import { use, useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Layout from "../../../components/Layout";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SingleBikeView({ params }) {
  const { id } = use(params); // FIX params

  const router = useRouter();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);

  // For Image Modal Preview
  const [previewImg, setPreviewImg] = useState(null);

  const getBike = async () => {
    try {
      const docRef = doc(db, "bikes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBike({ id, ...docSnap.data() });
      }
      setLoading(false);
    } catch (err) {
      console.log("Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBike();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!bike) return <p className="text-center py-10">Bike Not Found</p>;

  // ------------------------------------
  // ALL IMAGE KE KEYS ALAG RAKHO
  // ------------------------------------
  const photoKeys = [
    "frontsellerCNIC",
    "backsellerCNIC",
    "shopSlip",
    "sellerwithbikephoto",
    "page1",
    "page2",
    "page3",
    "page4",
    "bookFront",
    "bookBack",
    "smartFront",
    "smartBack",
    "front1ownerCNIC",
    "back1ownerCNIC",
    "front2ownerCNIC",
    "back2ownerCNIC",
    "buyerFrontCNICPhoto",
    "buyerBackCNICPhoto",
    "buyerWithBikePhoto",
    "saleSlip",
    "fileHandOwerSlip"
  ];

  return (
    <Layout>
      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="mb-5 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
      >
        ← Back
      </button>

      <div className="max-w-4xl mx-auto bg-white p-5 rounded shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Bike Details (View Only)
        </h1>



  <Divider title="Bike Registration Details" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Registration Number" value={bike.registrationNumber} />
          <Detail label="Chassis Number" value={bike.chassisNumber} />
          <Detail label="Engine Number" value={bike.engineNumber} />
          <Detail label="HP" value={bike.hp} />
          <Detail label="Model / Year" value={bike.modelYear} />
          <Detail label="Color" value={bike.color} />
          <Detail label="Maker" value={bike.maker} />
          <Detail label="Original Plates" value={bike.originalPlates} />
         
        </div>
{/* BIKE REGISTRATION IMAGES */}
<Divider title="Registration Images" />

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {[
    "page1",
    "page2",
    "page3",
    "page4",
    "bookFront",
    "bookBack",
    "smartFront",
    "smartBack",
    "front1ownerCNIC",
    "back1ownerCNIC",
    "front2ownerCNIC",
    "back2ownerCNIC",
  ].map((key) =>
    bike[key] ? (
      <div
        key={key}
        className="cursor-pointer"
        onClick={() => setPreviewImg(bike[key])}
      >
        <Image
          src={bike[key]}
          alt={key}
          width={300}
          height={200}
          className="rounded shadow-sm object-cover h-32 w-full"
        />
        <p className="text-center text-sm mt-1">{key}</p>
      </div>
    ) : null
  )}
</div>


                <Divider title="Purchase Info" />


        {/* ------------------- BASIC INFO ------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="Purchase Bill Number" value={bike.SellerbillNumber} />
          <Detail label="Purchase Date" value={bike.purchaseDate} />
          <Detail label="Purchase Time" value={bike.purchaseTime} />
          <Detail label="Seller Name" value={bike.sellerName} />
          <Detail label="Seller CNIC" value={bike.sellerCNIC} />
          <Detail label="Phone" value={bike.phone} />
          <Detail label="Address" value={bike.address} />
          <Detail label="Purchase Price" value={bike.purchaseprice} />

         
        </div>

      {/* PURCHASE DOCUMENT IMAGES */}
<Divider title="Purchase Documents" />

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {[
    "frontsellerCNIC",
    "backsellerCNIC",
    "shopSlip",
    "sellerwithbikephoto",
  ].map((key) =>
    bike[key] ? (
      <div
        key={key}
        className="cursor-pointer"
        onClick={() => setPreviewImg(bike[key])}
      >
        <Image
          src={bike[key]}
          alt={key}
          width={300}
          height={200}
          className="rounded shadow-sm object-cover h-32 w-full"
        />
        <p className="text-center text-sm mt-1">{key}</p>
      </div>
    ) : null
  )}
</div>


        <Divider title="Purchase Verification Details" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="CPLC Date" value={bike.SellercplcDate} />
          <Detail label="CPLC Time" value={bike.SellercplcTime} />
          <Detail label="CPLC Status" value={bike.SellercplcStatus} />
          <Detail label="Operator Number" value={bike.SelleroperatorNumber} />
        </div>

        <Divider title="Buyer Info" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Detail label="Buyer Bill Number" value={bike.BuyerbillNumber} />
          <Detail label="Account Number" value={bike.accountNumber} />

          <Detail label="Buyer Name" value={bike.buyerName} />
          <Detail label="Buyer CNIC" value={bike.buyerCNIC} />
          <Detail label="Buyer Phone" value={bike.buyerPhone} />
          <Detail label="Buyer Address" value={bike.buyerAddress} />
          <Detail label="Sale Price" value={bike.salePrice} />
          <Detail label="Payment Method" value={bike.paymentMethod} />
          <Detail label="File Handover Status" value={bike.fileHandoverStatus} />

         
        </div>
{/* BUYER DOCUMENT IMAGES */}
<Divider title="Buyer Documents" />

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
  {[
    "buyerFrontCNICPhoto",
    "buyerBackCNICPhoto",
    "buyerWithBikePhoto",
    "saleSlip",
    "fileHandOwerSlip",
  ].map((key) =>
    bike[key] ? (
      <div
        key={key}
        className="cursor-pointer"
        onClick={() => setPreviewImg(bike[key])}
      >
        <Image
          src={bike[key]}
          alt={key}
          width={300}
          height={200}
          className="rounded shadow-sm object-cover h-32 w-full"
        />
        <p className="text-center text-sm mt-1">{key}</p>
      </div>
    ) : null
  )}
</div>

 <Divider title="Buyer Verification Details" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Detail label="CPLC Date" value={bike.BuyercplcDate} />
          <Detail label="CPLC Time" value={bike.BuyercplcTime} />
          <Detail label="CPLC Status" value={bike.BuyercplcStatus} />
          <Detail label="Operator Number" value={bike.BuyeroperatorNumber} />
        </div>
        {/* ------------------- ALL IMAGES SECTION ------------------- */}


        {/* <Divider title="All Uploaded Photos" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photoKeys.map((key) =>
            bike[key] ? (
              <div
                key={key}
                className="cursor-pointer"
                onClick={() => setPreviewImg(bike[key])}
              >
                <Image
                  src={bike[key]}
                  alt={key}
                  width={300}
                  height={200}
                  className="rounded shadow-sm object-cover h-32 w-full"
                />
                <p className="text-center text-sm mt-1">{key}</p>
              </div>
            ) : null
          )}
        </div> */}
      </div>

      {/* ------------------- IMAGE MODAL ------------------- */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[999]"
          onClick={() => setPreviewImg(null)}
        >
          <Image
            src={previewImg}
            alt="Preview"
            width={900}
            height={700}
            className="rounded max-h-[90vh] object-contain"
          />
        </div>
      )}
    </Layout>
  );
}

function Detail({ label, value }) {
  return (
    <div className="p-3 bg-gray-100 rounded">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-gray-900">{value || "—"}</p>
    </div>
  );
}

function Divider({ title }) {
  return (
    <h2 className="text-xl font-bold mt-8 mb-3 border-b pb-2 text-gray-800">
      {title}
    </h2>
  );
}
