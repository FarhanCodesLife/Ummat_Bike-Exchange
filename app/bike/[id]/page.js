"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../../components/Layout";
import Tabs from "../../../components/Tabs";
import FormSection from "../../../components/FormSection";
import ImageUploader from "../../../components/ImageUploader";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ProtectedAdmin from "@/components/ProtectedAdmin";


const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// 🔥 All image keys used in AddBike
const IMAGE_KEYS = [
  "frontsellerCNIC", "backsellerCNIC", "shopSlip", "sellerwithbikephoto",
  "page1", "page2", "page3", "page4", "bookFront", "bookBack",
  "smartFront", "smartBack",
  "front1ownerCNIC", "back1ownerCNIC",
  "front2ownerCNIC", "back2ownerCNIC",
  "frontPhoto", "backPhoto", "leftPhoto", "rightPhoto",
  "meterPhoto", "enginePhoto", "chassisPhoto",
  "repairBill1", "repairBill2",
  "buyerFrontCNICPhoto", "buyerBackCNICPhoto",
  "buyerWithBikePhoto", "saleSlip",
  "salePhotos1", "salePhotos2",
  "fileHandOwerSlip"
];

export default function EditBike() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [existingFiles, setExistingFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // 📌 Fetch existing bike data
  useEffect(() => {
    if (!id) return;
    const fetchBike = async () => {
      const docRef = doc(db, "bikes", id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) return alert("Bike not found!");

      const data = snapshot.data();
      setFormData(data);

      const urls = {};
      IMAGE_KEYS.forEach((k) => {
        if (data[k]) urls[k] = data[k];
      });

      setExistingFiles(urls);
    };

    fetchBike();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e, key) =>
    setFiles({ ...files, [key]: e.target.files[0] });

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: fd,
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

  // Image field renderer
  const renderImages = (keys) =>
    keys.map((k) => (
      <ImageUploader
        key={k}
        label={k}
        existingUrl={existingFiles[k]}
        onChange={(e) => handleFileChange(e, k)}
      />
    ));

  // --------------------------------------------------
  // ALL TABS SAME AS ADD PAGE (JUST USING formData)
  // --------------------------------------------------

  const tabs = [
    {
      label: "Part 1: Purchase Info",
      content: (
        <FormSection title="Bill & Seller Information">
          <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Seller Bill Number</label>


            <input placeholder="Seller Bill Number " name="SellerbillNumber" value={formData.SellerbillNumber || ""} onChange={handleChange} className="input-field" />
            </div>

          <hr className="my-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Purchase Date</label>
            <input type="date" name="purchaseDate" value={formData.purchaseDate || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Purchase Time</label>
            <input type="time" name="purchaseTime" value={formData.purchaseTime || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Seller CNIC</label>
            <input name="sellerCNIC" value={formData.sellerCNIC || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Seller Name</label>
            <input name="sellerName" value={formData.sellerName || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Father Name</label>
            <input name="fatherName" value={formData.fatherName || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Address</label>
            <input name="address" value={formData.address || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Phone</label>
            <input name="phone" value={formData.phone || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Purchase Price</label>
            <input name="purchaseprice" value={formData.purchaseprice || ""} onChange={handleChange} className="input-field" />
</div>
          </div>

          <hr className="my-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderImages(["frontsellerCNIC", "backsellerCNIC", "shopSlip", "sellerwithbikephoto"])}
          </div>

          <hr className="my-6" />

          <h3 className="font-semibold mb-3">Bike Registration Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Registration Number</label>
            <input name="registrationNumber" value={formData.registrationNumber || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Chassis Number</label>
            <input name="chassisNumber" value={formData.chassisNumber || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Engine Number</label>
            <input name="engineNumber" value={formData.engineNumber || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Hp</label>
            <input name="hp" value={formData.hp || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Model Year</label>
            <input name="modelYear" value={formData.modelYear || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Color</label>
            <input name="color" value={formData.color || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Maker</label>
            <input name="maker" value={formData.maker || ""} onChange={handleChange} className="input-field" />
</div>

<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Original Plates</label>
            <select name="originalPlates" value={formData.originalPlates || ""} onChange={handleChange} className="input-field">
              <option value="">Original Plates?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
</div>

          <hr className="my-6" />

          <h3 className="font-semibold mb-3">Verification</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Cplc Date</label>
            <input type="date" name="SellercplcDate" value={formData.SellercplcDate || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Cplc Time</label>
            <input type="time" name="SellercplcTime" value={formData.SellercplcTime || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">CPLC Status</label>
            <select name="SellercplcStatus" value={formData.SellercplcStatus || ""} onChange={handleChange} className="input-field">
              <option value="">CPLC Status</option>
              <option value="Clear">Clear</option>
              <option value="Reported">Reported</option>
              <option value="Not Checked">Not Checked</option>
            </select>
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Operator Number</label>
            <input name="SelleroperatorNumber" value={formData.SelleroperatorNumber || ""} onChange={handleChange} className="input-field" />
</div>
          </div>

          <hr className="my-6" />

          <h3 className="font-semibold mb-3">Bike File / Book</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderImages(["page1", "page2", "page3", "page4", "bookFront", "bookBack", "smartFront", "smartBack"])}
          </div>

          <hr className="my-6" />

          <h3 className="font-semibold mb-3">Owner Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">1 Owner Name</label>
            <input name="1ownerName" value={formData["1ownerName"] || ""} onChange={handleChange} className="input-field" />
</div>
            {renderImages(["front1ownerCNIC", "back1ownerCNIC"])}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">2 Owner Name</label>
            <input name="2ownerName" value={formData["2ownerName"] || ""} onChange={handleChange} className="input-field" />
</div>
            {renderImages(["front2ownerCNIC", "back2ownerCNIC"])}
          </div>

          <hr className="my-6" />

          <h3 className="font-semibold mb-3">Bike Photos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderImages(["frontPhoto", "backPhoto", "leftPhoto", "rightPhoto", "meterPhoto", "enginePhoto", "chassisPhoto"])}
          </div>
        </FormSection>
      ),
    },

    {
      label: "Part 2: Repair Info",
      content: (
        <FormSection title="Repair / Cost Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderImages(["repairBill1", "repairBill2"])}
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Repair Description</label>

            <input placeholder="Repair Description" name="repairDescription" value={formData.repairDescription || ""} onChange={handleChange} className="input-field" />
            </div>

            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Repair Cost</label>

            <input placeholder="Repair Cost" type="number" name="repairCost" value={formData.repairCost || ""} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </FormSection>
      ),
    },

    {
      label: "Part 3: Sale Info",
      content: (
        <FormSection title="Sale / Customer Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Buyer Bill  Number</label>


            <input placeholder="Buyer Bill Number " name="BuyerbillNumber" value={formData.BuyerbillNumber || ""}   onChange={handleChange} className="input-field" />
            </div>

            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Account Number</label>


              <input name="accountNumber" placeholder="Acount Number" value={formData.accountNumber || ""} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Sale Date</label>
              <input type="date" name="saleDate"  value={formData.saleDate || ""} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Sale Time</label>


              <input type="time" name="saleTime" value={formData.saleTime || ""} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Buyer Name</label>
              <input name="buyerName" placeholder="Buyer Name" value={formData.buyerName || ""} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Buyer CNIC</label>

              <input name="buyerCNIC" placeholder="Buyer CNIC" value={formData.buyerCNIC || ""} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Buyer Phone</label>

              <input name="buyerPhone" placeholder="Buyer Phone" value={formData.buyerPhone || ""} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Buyer Address</label>

              <input name="buyerAddress" placeholder="Buyer Address" value={formData.buyerAddress || ""} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Sale Price</label>

              <input type="number" placeholder="Sale Price" name="salePrice" value={formData.salePrice || ""} onChange={handleChange} className="input-field" />
            </div>

             <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Payment Method</label>

            <select name="paymentMethod" value={formData.paymentMethod || ""} onChange={handleChange} className="input-field">
              <option value="">Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Installment">Installment</option>
            </select>

            </div>
            <select name="fileHandoverStatus" value={formData.fileHandoverStatus || ""} onChange={handleChange} className="input-field">
              <option value="">File Handover Status</option>
              <option value="With Showroom">With Showroom</option>
              <option value="Handed to Customer">Handed to Customer</option>
            </select>


             

            {renderImages(["buyerFrontCNICPhoto", "buyerBackCNICPhoto", "buyerWithBikePhoto", "saleSlip", "salePhotos1", "salePhotos2"])}

 <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">File Handover Date</label>

            <input type="date" name="fileHandoverDate" value={formData.fileHandoverDate || ""} onChange={handleChange} className="input-field" />
            </div>

            {renderImages(["fileHandOwerSlip"])}
          </div>
          <hr className="my-6" />

          <h3 className="font-semibold mb-3">Buyer Verification</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Buyer Cplc Date</label>
            <input type="date" name="BuyercplcDate" value={formData.BuyercplcDate || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Buyer Cplc Time</label>
            <input type="time" name="BuyercplcTime" value={formData.BuyercplcTime || ""} onChange={handleChange} className="input-field" />
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">Buyer CPLC Status</label>
            <select name="BuyercplcStatus" value={formData.BuyercplcStatus || ""} onChange={handleChange} className="input-field">
              <option value="">CPLC Status</option>
              <option value="Clear">Clear</option>
              <option value="Reported">Reported</option>
              <option value="Not Checked">Not Checked</option>
            </select>
</div>
<div className="flex flex-col"> <label className="font-semibold text-gray-700 mb-1">BuyerOperator Number</label>
            <input name="BuyeroperatorNumber" value={formData.BuyeroperatorNumber || ""} onChange={handleChange} className="input-field" />
</div>
          </div>
        </FormSection>
      ),
    }
  ];

  return (
        <ProtectedAdmin>

    <Layout>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Bike</h2>

      <Tabs tabs={tabs} />

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6">
        <button
          type="submit"
          className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Bike"}
        </button>
      </form>
    </Layout>
    </ProtectedAdmin>
  );
}
