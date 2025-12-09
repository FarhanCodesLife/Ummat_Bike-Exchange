"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../../components/Layout";
import Tabs from "../../../components/Tabs";
import FormSection from "../../../components/FormSection";
import ImageUploader from "../../../components/ImageUploader";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AddBike() {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed");
    return data.secure_url; // URL as string
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls = {};
      for (const key in files) {
        if (files[key]) {
          uploadedUrls[key] = await uploadToCloudinary(files[key]);
        }
      }

      await addDoc(collection(db, "bikes"), {
        ...formData,
        ...uploadedUrls,
        createdAt: new Date(),
      });

      alert("Bike added successfully!");
      router.push("/bike");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
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
            <input placeholder="Bill Number / Form Number" name="billNumber" onChange={handleChange} className="input-field"/>
            <input placeholder="Purchase Date & Time" name="purchaseDate" onChange={handleChange} className="input-field"/>
            <input placeholder="Seller CNIC Number" name="sellerCNIC" onChange={handleChange} className="input-field"/>
            <input placeholder="Seller Name" name="sellerName" onChange={handleChange} className="input-field"/>
            <input placeholder="Father Name" name="fatherName" onChange={handleChange} className="input-field"/>
            <input placeholder="Address" name="address" onChange={handleChange} className="input-field"/>
            <input placeholder="Phone Number" name="phone" onChange={handleChange} className="input-field"/>
          </div>

          <hr className="my-6 border-gray-300"/>
          <h3 className="font-semibold mb-3 text-gray-700">B. Bike Registration Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Registration Number" name="registrationNumber" onChange={handleChange} className="input-field"/>
            <input placeholder="Chassis Number" name="chassisNumber" onChange={handleChange} className="input-field"/>
            <input placeholder="Engine Number" name="engineNumber" onChange={handleChange} className="input-field"/>
            <input placeholder="Horse Power (HP)" name="hp" onChange={handleChange} className="input-field"/>
            <input placeholder="Model / Year" name="modelYear" onChange={handleChange} className="input-field"/>
            <input placeholder="Colour" name="color" onChange={handleChange} className="input-field"/>
            <input placeholder="Maker / Company" name="maker" onChange={handleChange} className="input-field"/>
            <select name="originalPlates" onChange={handleChange} className="input-field">
              <option value="">Original Number Plates Available?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <hr className="my-6 border-gray-300"/>
          <h3 className="font-semibold mb-3 text-gray-700">C. Verification Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="CPLC Checked Date" name="cplcDate" onChange={handleChange} className="input-field"/>
            <select name="cplcStatus" onChange={handleChange} className="input-field">
              <option value="">CPLC Status</option>
              <option value="Clear">Clear</option>
              <option value="Reported">Reported</option>
              <option value="Not Checked">Not Checked</option>
            </select>
            <input placeholder="Operator Number" name="operatorNumber" onChange={handleChange} className="input-field"/>
          </div>

          <hr className="my-6 border-gray-300"/>
          <h3 className="font-semibold mb-3 text-gray-700">D. Bike File / Book Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["page1","page2","page3","page4","bookFront","bookBack","smartFront","smartBack"].map(key => (
              <ImageUploader key={key} label={key} onChange={(e)=>handleFileChange(e,key)}/>
            ))}
          </div>

          <hr className="my-6 border-gray-300"/>
          <h3 className="font-semibold mb-3 text-gray-700">E. Owner Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Owner Name" name="ownerName" onChange={handleChange} className="input-field"/>
            <ImageUploader label="First Owner CNIC Photo" onChange={(e)=>handleFileChange(e,"ownerCNIC")}/>
            <ImageUploader label="Ummat Bike Exchange Slip" onChange={(e)=>handleFileChange(e,"shopSlip")}/>

          </div>

          <hr className="my-6 border-gray-300"/>
          <h3 className="font-semibold mb-3 text-gray-700">F. Bike Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["frontPhoto","backPhoto","leftPhoto","rightPhoto","meterPhoto","enginePhoto","chassisPhoto"].map(key => (
              <ImageUploader key={key} label={key} onChange={(e)=>handleFileChange(e,key)}/>
            ))}
          </div>
        </FormSection>
      ),
    },
    {
      label: "Part 2: Repair Info",
      content: (
        <FormSection title="Repair / Cost Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploader label="Repair Bill Photo" onChange={(e)=>handleFileChange(e,"repairBill")}/>
            <input placeholder="Description" name="repairDescription" onChange={handleChange} className="input-field"/>
            <input placeholder="Cost" name="repairCost" type="number" onChange={handleChange} className="input-field"/>
          </div>
        </FormSection>
      ),
    },
    {
      label: "Part 3: Sale Info",
      content: (
        <FormSection title="Sale / Customer Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input placeholder="Account Number" name="accountNumber" onChange={handleChange} className="input-field"/>
            <input placeholder="Sale Date & Time" name="saleDate" onChange={handleChange} className="input-field"/>
            <input placeholder="Buyer Name" name="buyerName" onChange={handleChange} className="input-field"/>
            <input placeholder="Buyer CNIC Number" name="buyerCNIC" onChange={handleChange} className="input-field"/>
            <input placeholder="Buyer Phone Number" name="buyerPhone" onChange={handleChange} className="input-field"/>
            <input placeholder="Buyer Address" name="buyerAddress" onChange={handleChange} className="input-field"/>
            <input placeholder="Sale Price" name="salePrice" type="number" onChange={handleChange} className="input-field"/>
            <select name="paymentMethod" onChange={handleChange} className="input-field">
              <option value="">Cash / Installment</option>
              <option value="Cash">Cash</option>
              <option value="Installment">Installment</option>
            </select>
            <select name="fileHandoverStatus" onChange={handleChange} className="input-field">
              <option value="">File / Registration Book Handover Status</option>
              <option value="With Showroom">With Showroom</option>
              <option value="Handed to Customer">Handed to Customer</option>
              <option value="Pending">Pending</option>
            </select>
            <input placeholder="File Handover Date" name="fileHandoverDate" onChange={handleChange} className="input-field"/>
            <ImageUploader label="Sale Receipt (image/pdf)" onChange={(e)=>handleFileChange(e,"saleReceipt")}/>
            <ImageUploader label="Buyer CNIC Photo" onChange={(e)=>handleFileChange(e,"buyerCNICPhoto")}/>
            <ImageUploader label="Sale Agreement / Invoice" onChange={(e)=>handleFileChange(e,"saleAgreement")}/>
            <ImageUploader label="Sale Photos (Front / Side / Meter)" onChange={(e)=>handleFileChange(e,"salePhotos")}/>
          </div>
        </FormSection>
      ),
    },
  ];

  return (
   <Layout>
  <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Bike</h2>

  <Tabs tabs={tabs} />

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
  );
}
