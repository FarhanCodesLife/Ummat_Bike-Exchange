"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../components/Layout";
import Tabs from "../../../components/Tabs";
import ImageUploader from "../../../components/ImageUploader";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";
import FormSection from "../../../components/FormSection";
import ProtectedAdmin from "@/components/ProtectedAdmin";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AddBike() {
  const router = useRouter();

  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  /* ---------------- AUTO SAVE DRAFT ---------------- */
  useEffect(() => {
    localStorage.setItem(
      "bikeDraft",
      JSON.stringify({ formData, files })
    );
  }, [formData, files]);

  useEffect(() => {
    const saved = localStorage.getItem("bikeDraft");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData || {});
      setFiles(parsed.files || {});
    }
  }, []);

  /* ---------------- INPUT HANDLERS ---------------- */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  /* ---------------- IMAGE COMPRESS ---------------- */
  const compressImage = async (file) => {
    return await imageCompression(file, {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
    });
  };

  /* ---------------- CLOUDINARY ---------------- */
  const uploadToCloudinary = async (file) => {
    const compressed = await compressImage(file);

    const fd = new FormData();
    fd.append("file", compressed);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      { method: "POST", body: fd }
    );

    const data = await res.json();
    return data.secure_url;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImages = {};

      for (const key in files) {
        uploadedImages[key] = await uploadToCloudinary(files[key]);
      }

      await addDoc(collection(db, "bikes"), {
        ...formData,
        images: uploadedImages,
        createdAt: new Date(),
      });

      localStorage.removeItem("bikeDraft");
      alert("Bike saved successfully");
      router.push("/bike");
    } catch (err) {
      console.error(err);
      alert("Error saving bike");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      label: "Part 1: Purchase Info",
      content: (
        <FormSection title="A. Bill & Seller Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Seller Bill Number</label>

            
            <input placeholder="Seller Bill Number "  name="SellerbillNumber" required  onChange={handleChange} className="inputClass" />
          </div>
          </div>
          <hr className="my-6 border-gray-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Purchase Date</label>

              <input placeholder="Purchase Date" name="purchaseDate" type="date" required  onChange={handleChange} className="inputClass" />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700 mb-1">Purchase Time</label>

              <input placeholder="Purchase Time" name="purchaseTime" type="time" required  onChange={handleChange} className="inputClass" />
            </div>
            <input placeholder="Seller CNIC Number" name="sellerCNIC" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Seller Name" name="sellerName" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Father Name" name="fatherName" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Address" name="address" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Phone Number" name="phone" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Purchase Price" name="purchaseprice" required  onChange={handleChange} className="inputClass" />
          </div>
          <hr className="my-6 border-gray-300" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


            <ImageUploader label="Seller CNIC Photo Front" required  onChange={(e) => handleFileChange(e, "frontsellerCNIC")} />
            <ImageUploader label="Seller CNIC Photo Back" required  onChange={(e) => handleFileChange(e, "backsellerCNIC")} />

            <ImageUploader label="Ummat Bike Exchange Slip" required  onChange={(e) => handleFileChange(e, "shopSlip")} />
            <ImageUploader label="Seller With Bike Photo" required  onChange={(e) => handleFileChange(e, "sellerwithbikephoto")} />

          </div>
          <hr className="my-6 border-gray-300" />
          <h3 className="font-semibold mb-3 text-gray-700">B. Bike Registration Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Registration Number" name="registrationNumber" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Chassis Number" name="chassisNumber" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Engine Number" name="engineNumber" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Horse Power (HP)" name="hp" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Model / Year" name="modelYear" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Colour" name="color" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Maker / Company" name="maker" required  onChange={handleChange} className="inputClass" />
            <select name="originalPlates" required  onChange={handleChange} className="inputClass">
              <option value="">Original Number Plates Available?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <hr className="my-6 border-gray-300" />
          <h3 className="font-semibold mb-3 text-gray-700">C. Verification Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">CPLC Checked Date</label>

            
            <input placeholder="CPLC Checked Date" name="SellercplcDate" type="date" required  onChange={handleChange} className="inputClass" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">CPLC Checked Time</label>

            
            <input placeholder="CPLC Checked Time" name="SellercplcTime" type="time" required  onChange={handleChange} className="inputClass" />
          </div>
          </div>
            <select name="SellercplcStatus" required  onChange={handleChange} className="inputClass">
              <option value="">CPLC Status</option>
              <option value="Clear">Clear</option>
              <option value="Reported">Reported</option>
              <option value="Not Checked">Not Checked</option>
            </select>
            <input placeholder="Operator Number" name="SelleroperatorNumber" required  onChange={handleChange} className="inputClass" />
          </div>

          <hr className="my-6 border-gray-300" />
          <h3 className="font-semibold mb-3 text-gray-700">D. Bike File / Book Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["page1", "page2", "page3", "page4", "bookFront", "bookBack", "smartFront", "smartBack"].map(key => (
              <ImageUploader key={key} label={key} required  onChange={(e) => handleFileChange(e, key)} />
            ))}
          </div>

          <hr className="my-6 border-gray-300" />
          <h3 className="font-semibold mb-3 text-gray-700">E. Owner Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">1 Owner Name</label>

            
            <input placeholder="1 Owner Name" name="1ownerName" required  onChange={handleChange} className="inputClass" />
          </div>
            <ImageUploader label="CNIC Front Photo First Owner " required  onChange={(e) => handleFileChange(e, "front1ownerCNIC")} />
            <ImageUploader label="Back Photo First Owner CNIC " required  onChange={(e) => handleFileChange(e, "back1ownerCNIC")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">2 Owner Name</label>

            
            <input placeholder="2 Owner Name" name="2ownerName" required  onChange={handleChange} className="inputClass" />
          </div>
            <ImageUploader label="Front Photo Second Owner CNIC " required  onChange={(e) => handleFileChange(e, "front2ownerCNIC")} />
            <ImageUploader label="Back Photo Second Owner CNIC " required  onChange={(e) => handleFileChange(e, "front2ownerCNIC")} />
          </div>

          {/* <hr className="my-6 border-gray-300" />
          <h3 className="font-semibold mb-3 text-gray-700">F. Bike Photos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["frontPhoto", "backPhoto", "leftPhoto", "rightPhoto", ].map(key => (
              <ImageUploader key={key} label={key} required  onChange={(e) => handleFileChange(e, key)} />
            ))}
          </div> */}
        </FormSection>
      ),
    },
    {
      label: "Part 2: Repair Info",
      content: (
        <FormSection title="Repair / Cost Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploader label="Repair Bill Photo 1" required  onChange={(e) => handleFileChange(e, "repairBill1")} />
            <ImageUploader label="Repair Bill Photo 2" required  onChange={(e) => handleFileChange(e, "repairBill2")} />
            <input placeholder="Description" name="repairDescription" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Cost" name="repairCost" type="number" required  onChange={handleChange} className="inputClass" />
          </div>
        </FormSection>
      ),
    },
    {
      label: "Part 3: Sale Info",
      content: (
        <FormSection title="Sale / Customer Info">
                    <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 gap-4">

            <input placeholder="Buyer Bill Number " name="BuyerbillNumber" required  onChange={handleChange} className="inputClass" />
         </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            
            <input placeholder="Account Number" name="accountNumber" required  onChange={handleChange} className="inputClass" />
           <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Sale Date</label>
        
            <input placeholder="Sale Date" name="saleDate" type="date" required  onChange={handleChange} className="inputClass" />
</div>

<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Sale Time</label>
        
            <input placeholder="Sale Time" name="saleTime" type="time" required  onChange={handleChange} className="inputClass" />
</div>
            <input placeholder="Buyer Name" name="buyerName" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Buyer CNIC Number" name="buyerCNIC" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Buyer Phone Number" name="buyerPhone" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Buyer Address" name="buyerAddress" required  onChange={handleChange} className="inputClass" />
            <input placeholder="Sale Price" name="salePrice" type="number" required  onChange={handleChange} className="inputClass" />
            <select name="paymentMethod" required  onChange={handleChange} className="inputClass">
            <option value="">Payment Method</option>

              <option value="Cash">Cash</option>
              <option value="Installment">Installment</option>
            </select>
            <select name="fileHandoverStatus" required  onChange={handleChange} className="inputClass">
              <option value="">File / Registration Book Handover Status</option>
              <option value="With Showroom">With Showroom</option>
              <option value="Handed to Customer">Handed to Customer</option>
              {/* <option value="Pending">Pending</option> */}
            </select>


            
            

            <ImageUploader label="Buyer CNIC Front Photo" required  onChange={(e) => handleFileChange(e, "buyerFrontCNICPhoto")} />
            <ImageUploader label="Buyer CNIC Back Photo" required  onChange={(e) => handleFileChange(e, "buyerBackCNICPhoto")} />
            <ImageUploader label="Buyer With Bike Photo" required  onChange={(e) => handleFileChange(e, "buyerWithBikePhoto")} />
            <ImageUploader label="Sale Slip" required  onChange={(e) => handleFileChange(e, "saleSlip")} />
            {/* <ImageUploader label="Sale Photos (Front / Side / Meter)" required  onChange={(e) => handleFileChange(e, "salePhotos1")} />
            <ImageUploader label="Sale Photos (Front / Side / Meter)" required  onChange={(e) => handleFileChange(e, "salePhotos2")} />
             */}
             <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">File Handover Date</label>
                       <input placeholder="File Handover Date" name="fileHandoverDate" type="date" required  onChange={handleChange} className="inputClass" />

          </div>




            <ImageUploader label="File Handover Slip" required  onChange={(e) => handleFileChange(e, "fileHandOwerSlip")} />
          </div>


<hr className="my-6 border-gray-300" />
          <h3 className="font-semibold mb-3 text-gray-700"> Verification Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">CPLC Checked Date</label>

            <input placeholder="CPLC Checked Date" name="BuyercplcDate" type="date" required  onChange={handleChange} className="inputClass" />
          </div>
                      <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">CPLC Checked Time</label>

            <input placeholder="CPLC Checked Time" name="BuyercplcTime" type="time" required  onChange={handleChange} className="inputClass" />
          </div>
            <select name="BuyercplcStatus" required  onChange={handleChange} className="inputClass">
              <option value="">CPLC Status</option>
              <option value="Clear">Clear</option>
              <option value="Reported">Reported</option>
              <option value="Not Checked">Not Checked</option>
            </select>
            <input placeholder="Operator Number" name="BuyeroperatorNumber" required  onChange={handleChange} className="inputClass" />
          </div>

        </FormSection>
      ),
    },
  ];

  return (
            <ProtectedAdmin>
    
    <Layout>
       {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center">
            <h2 className="font-bold text-xl">Saving Record</h2>
            <p className="text-gray-600 mt-2">Uploading images...</p>
            <div className="mt-4 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Bike</h2>

     <Tabs
  tabs={tabs}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Bike"}
        </button>
      </form>
    </Layout>
            </ProtectedAdmin>
    
  );
}
