"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../../components/Layout";
import Tabs from "../../../components/Tabs";
import FormSection from "../../../components/FormSection";
import ImageUploader from "../../../components/ImageUploader";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const IMAGE_KEYS = [
  "page1","page2","page3","page4","bookFront","bookBack","smartFront","smartBack",
  "ownerCNIC","frontPhoto","backPhoto","leftPhoto","rightPhoto","meterPhoto",
  "enginePhoto","chassisPhoto","repairBill","saleReceipt","buyerCNICPhoto",
  "saleAgreement","salePhotos"
];

export default function EditBike() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [existingFiles, setExistingFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch existing bike data
  useEffect(() => {
    if (!id) return;
    const fetchBike = async () => {
      const docRef = doc(db, "bikes", id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return alert("Bike not found!");
      const data = snapshot.data();
      setFormData(data);

      const urls = {};
      IMAGE_KEYS.forEach((k) => { if (data[k]) urls[k] = data[k]; });
      setExistingFiles(urls);
    };
    fetchBike();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e, key) => setFiles({ ...files, [key]: e.target.files[0] });

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
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedUrls = { ...existingFiles };

      for (const key of IMAGE_KEYS) {
        if (files[key]) {
          uploadedUrls[key] = await uploadToCloudinary(files[key]);
        }
      }

      const docRef = doc(db, "bikes", id);
      await updateDoc(docRef, { ...formData, ...uploadedUrls });
      alert("Bike updated successfully!");
      router.push("/bike");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderImageFields = (keys) =>
    keys.map((key) => (
      <ImageUploader
        key={key}
        label={key}
        existingUrl={existingFiles[key]}
        onChange={(e) => handleFileChange(e, key)}
      />
    ));

  const tabs = [
  {
    label: "Part 1: Purchase Info",
    content: (
      <FormSection title="A. Bill & Seller Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bill Number / Form Number */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Bill Number / Form Number</label>
            <input
              placeholder="Enter Bill Number"
              value={formData.billNumber || ""}
              name="billNumber"
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Purchase Date & Time</label>
            <input
              placeholder="Enter Purchase Date & Time"
              value={formData.purchaseDate || ""}
              name="purchaseDate"
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Seller CNIC Number</label>
            <input
              placeholder="Enter Seller CNIC"
              value={formData.sellerCNIC || ""}
              name="sellerCNIC"
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Seller Name</label>
            <input
              placeholder="Enter Seller Name"
              value={formData.sellerName || ""}
              name="sellerName"
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Father Name</label>
            <input
              placeholder="Enter Father Name"
              value={formData.fatherName || ""}
              name="fatherName"
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Address</label>
            <input
              placeholder="Enter Address"
              value={formData.address || ""}
              name="address"
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              placeholder="Enter Phone Number"
              value={formData.phone || ""}
              name="phone"
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Owner Name</label>
            <input
              placeholder="Enter Owner Name"
              value={formData.ownerName || ""}
              name="ownerName"
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>



       
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">Registration Number</label>
    <input
      placeholder="Enter Registration Number"
      value={formData.registrationNumber || ""}
      name="registrationNumber"
      onChange={handleChange}
      className="input-field w-full"
    />
  </div>

  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">Chassis Number</label>
    <input
      placeholder="Enter Chassis Number"
      value={formData.chassisNumber || ""}
      name="chassisNumber"
      onChange={handleChange}
      className="input-field w-full"
    />
  </div>

  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">Engine Number</label>
    <input
      placeholder="Enter Engine Number"
      value={formData.engineNumber || ""}
      name="engineNumber"
      onChange={handleChange}
      className="input-field w-full"
    />
  </div>

  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">Horse Power (HP)</label>
    <input
      placeholder="Enter Horse Power"
      value={formData.hp || ""}
      name="hp"
      onChange={handleChange}
      className="input-field w-full"
    />
  </div>

  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">Model / Year</label>
    <input
      placeholder="Enter Model / Year"
      value={formData.modelYear || ""}
      name="modelYear"
      onChange={handleChange}
      className="input-field w-full"
    />
  </div>

  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">Colour</label>
    <input
      placeholder="Enter Colour"
      value={formData.color || ""}
      name="color"
      onChange={handleChange}
      className="input-field w-full"
    />
  </div>

  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">Maker / Company</label>
    <input
      placeholder="Enter Maker / Company"
      value={formData.maker || ""}
      name="maker"
      onChange={handleChange}
      className="input-field w-full"
    />
  </div>

  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-1">Original Number Plates Available?</label>
    <select
      name="originalPlates"
      value={formData.originalPlates || ""}
      onChange={handleChange}
      className="input-field w-full"
    >
      <option value="">Select an option</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>


        

        </div>

        {/* Image Upload Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {renderImageFields([
            "ownerCNIC",
            "shopSlip",
            "frontPhoto",
            "backPhoto",
            "leftPhoto",
            "rightPhoto",
            "meterPhoto",
            "enginePhoto",
            "chassisPhoto",
            "page1",
            "page2",
            "page3",
            "page4",
            "bookFront",
            "bookBack",
            "smartFront",
            "smartBack",
          ])}
        </div>
      
        </FormSection>
      ),
    },
    {
      label: "Part 2: Repair Info",
      content: (
        <FormSection title="Repair Info">
          {renderImageFields(["repairBill"])}
          <input name="repairDescription" value={formData.repairDescription || ""} onChange={handleChange} className="input-field" placeholder="Repair Description" />
          <input name="repairCost" type="number" value={formData.repairCost || ""} onChange={handleChange} className="input-field" placeholder="Repair Cost" />
        </FormSection>
      ),
    },
    {
      label: "Part 3: Sale Info",
      content: (
        <FormSection title="Sale Info">
          <input name="buyerName" value={formData.buyerName || ""} onChange={handleChange} className="input-field" placeholder="Buyer Name" />
          <input name="buyerPhone" value={formData.buyerPhone || ""} onChange={handleChange} className="input-field" placeholder="Buyer Phone" />
          <input name="salePrice" type="number" value={formData.salePrice || ""} onChange={handleChange} className="input-field" placeholder="Sale Price" />
          {renderImageFields(["saleReceipt","buyerCNICPhoto","saleAgreement","salePhotos"])}
        </FormSection>
      ),
    },
  ];

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Bike</h2>
      <Tabs tabs={tabs} />
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-all duration-200">
          {loading ? "Updating..." : "Update Bike"}
        </button>
      </form>
    </Layout>
  );
}
