"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../../components/Layout";
import Tabs from "../../../components/Tabs";
import FormSection from "../../../components/FormSection";
import ImageUploader from "../../../components/ImageUploader";
import { db, storage } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditBike() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch bike data by ID
  useEffect(() => {
    const fetchBike = async () => {
      const docRef = doc(db, "bikes", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) setFormData(snapshot.data());
      else alert("Bike not found!");
    };
    fetchBike();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Upload new files if changed
    const uploadedUrls = {};
    for (const key in files) {
      if (files[key]) {
        const storageRef = ref(storage, `bikes/${Date.now()}_${files[key].name}`);
        await uploadBytes(storageRef, files[key]);
        uploadedUrls[key] = await getDownloadURL(storageRef);
      }
    }

    try {
      const docRef = doc(db, "bikes", id);
      await updateDoc(docRef, { ...formData, ...uploadedUrls });
      alert("Bike updated successfully!");
      router.push("/bike");
    } catch (err) {
      console.error(err);
      alert("Error updating bike!");
    } finally {
      setLoading(false);
    }
  };

  // Tabs content (same as Add form, but pre-filled)
  const tabs = [
    {
      label: "Part 1: Purchase Info",
      content: (
        <FormSection title="A. Bill & Seller Information">
          <input placeholder="Bill Number / Form Number" name="billNumber" value={formData.billNumber || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Purchase Date & Time" name="purchaseDate" value={formData.purchaseDate || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Seller CNIC Number" name="sellerCNIC" value={formData.sellerCNIC || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Seller Name" name="sellerName" value={formData.sellerName || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Father Name" name="fatherName" value={formData.fatherName || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Address" name="address" value={formData.address || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Phone Number" name="phone" value={formData.phone || ""} onChange={handleChange} className="input-field"/>

          <hr className="my-4"/>
          <h3 className="font-semibold mb-2">B. Bike Registration Details</h3>
          <input placeholder="Registration Number" name="registrationNumber" value={formData.registrationNumber || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Chassis Number" name="chassisNumber" value={formData.chassisNumber || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Engine Number" name="engineNumber" value={formData.engineNumber || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Horse Power (HP)" name="hp" value={formData.hp || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Model / Year" name="modelYear" value={formData.modelYear || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Colour" name="color" value={formData.color || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Maker / Company" name="maker" value={formData.maker || ""} onChange={handleChange} className="input-field"/>
          <select name="originalPlates" value={formData.originalPlates || ""} onChange={handleChange} className="input-field">
            <option value="">Original Number Plates Available?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <hr className="my-4"/>
          <h3 className="font-semibold mb-2">C. Verification Details</h3>
          <input placeholder="CPLC Checked Date" name="cplcDate" value={formData.cplcDate || ""} onChange={handleChange} className="input-field"/>
          <select name="cplcStatus" value={formData.cplcStatus || ""} onChange={handleChange} className="input-field">
            <option value="">CPLC Status</option>
            <option value="Clear">Clear</option>
            <option value="Reported">Reported</option>
            <option value="Not Checked">Not Checked</option>
          </select>
          <input placeholder="Operator Number" name="operatorNumber" value={formData.operatorNumber || ""} onChange={handleChange} className="input-field"/>

          <hr className="my-4"/>
          <h3 className="font-semibold mb-2">D. Bike File / Book Details</h3>
          <ImageUploader label="Page 1" onChange={(e)=>handleFileChange(e,"page1")}/>
          <ImageUploader label="Page 2" onChange={(e)=>handleFileChange(e,"page2")}/>
          <ImageUploader label="Page 3" onChange={(e)=>handleFileChange(e,"page3")}/>
          <ImageUploader label="Page 4" onChange={(e)=>handleFileChange(e,"page4")}/>
          <ImageUploader label="Book Front" onChange={(e)=>handleFileChange(e,"bookFront")}/>
          <ImageUploader label="Book Back" onChange={(e)=>handleFileChange(e,"bookBack")}/>
          <ImageUploader label="Smart Card Front" onChange={(e)=>handleFileChange(e,"smartFront")}/>
          <ImageUploader label="Smart Card Back" onChange={(e)=>handleFileChange(e,"smartBack")}/>

          <hr className="my-4"/>
          <h3 className="font-semibold mb-2">E. Owner Information</h3>
          <input placeholder="Owner Name" name="ownerName" value={formData.ownerName || ""} onChange={handleChange} className="input-field"/>
          <ImageUploader label="First Owner CNIC Photo" onChange={(e)=>handleFileChange(e,"ownerCNIC")}/>

          <hr className="my-4"/>
          <h3 className="font-semibold mb-2">F. Bike Photos</h3>
          <ImageUploader label="Front Photo" onChange={(e)=>handleFileChange(e,"frontPhoto")}/>
          <ImageUploader label="Back Photo" onChange={(e)=>handleFileChange(e,"backPhoto")}/>
          <ImageUploader label="Left Side" onChange={(e)=>handleFileChange(e,"leftPhoto")}/>
          <ImageUploader label="Right Side" onChange={(e)=>handleFileChange(e,"rightPhoto")}/>
          <ImageUploader label="Meter Photo" onChange={(e)=>handleFileChange(e,"meterPhoto")}/>
          <ImageUploader label="Engine Number Photo" onChange={(e)=>handleFileChange(e,"enginePhoto")}/>
          <ImageUploader label="Chassis Number Photo" onChange={(e)=>handleFileChange(e,"chassisPhoto")}/>
        </FormSection>
      ),
    },
    {
      label: "Part 2: Repair Info",
      content: (
        <FormSection title="Repair / Cost Info">
          <ImageUploader label="Repair Bill Photo" onChange={(e)=>handleFileChange(e,"repairBill")}/>
          <input placeholder="Description" name="repairDescription" value={formData.repairDescription || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Cost" name="repairCost" type="number" value={formData.repairCost || ""} onChange={handleChange} className="input-field"/>
        </FormSection>
      ),
    },
    {
      label: "Part 3: Sale Info",
      content: (
        <FormSection title="Sale / Customer Info">
          <input placeholder="Account Number" name="accountNumber" value={formData.accountNumber || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Sale Date & Time" name="saleDate" value={formData.saleDate || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Buyer Name" name="buyerName" value={formData.buyerName || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Buyer CNIC Number" name="buyerCNIC" value={formData.buyerCNIC || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Buyer Phone Number" name="buyerPhone" value={formData.buyerPhone || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Buyer Address" name="buyerAddress" value={formData.buyerAddress || ""} onChange={handleChange} className="input-field"/>
          <input placeholder="Sale Price" name="salePrice" type="number" value={formData.salePrice || ""} onChange={handleChange} className="input-field"/>
          <select name="paymentMethod" value={formData.paymentMethod || ""} onChange={handleChange} className="input-field">
            <option value="">Cash / Installment</option>
            <option value="Cash">Cash</option>
            <option value="Installment">Installment</option>
          </select>
          <select name="fileHandoverStatus" value={formData.fileHandoverStatus || ""} onChange={handleChange} className="input-field">
            <option value="">File / Registration Book Handover Status</option>
            <option value="With Showroom">With Showroom</option>
            <option value="Handed to Customer">Handed to Customer</option>
            <option value="Pending">Pending</option>
          </select>
          <input placeholder="File Handover Date" name="fileHandoverDate" value={formData.fileHandoverDate || ""} onChange={handleChange} className="input-field"/>
          <ImageUploader label="Sale Receipt (image/pdf)" onChange={(e)=>handleFileChange(e,"saleReceipt")}/>
          <ImageUploader label="Buyer CNIC Photo" onChange={(e)=>handleFileChange(e,"buyerCNICPhoto")}/>
          <ImageUploader label="Sale Agreement / Invoice (optional)" onChange={(e)=>handleFileChange(e,"saleAgreement")}/>
          <ImageUploader label="Sale Photos (Front / Side / Meter)" onChange={(e)=>handleFileChange(e,"salePhotos")}/>
        </FormSection>
      ),
    },
  ];

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Edit Bike</h2>
      {Object.keys(formData).length > 0 ? (
        <form onSubmit={handleSubmit}>
          <Tabs tabs={tabs}/>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-700" disabled={loading}>
            {loading ? "Updating..." : "Update Bike"}
          </button>
        </form>
      ) : (
        <p>Loading bike data...</p>
      )}
    </Layout>
  );
}
