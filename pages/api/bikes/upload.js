import multer from "multer";
import cloudinary from "../../../lib/cloudinary";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// Convert multer to promise for single API route
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await runMiddleware(req, upload.fields([
      { name: "page1" }, { name: "page2" }, { name: "page3" }, { name: "page4" },
      { name: "bookFront" }, { name: "bookBack" },
      { name: "smartFront" }, { name: "smartBack" },
      { name: "ownerCNIC" },
      { name: "frontPhoto" }, { name: "backPhoto" }, { name: "leftPhoto" },
      { name: "rightPhoto" }, { name: "meterPhoto" }, { name: "enginePhoto" }, { name: "chassisPhoto" },
      { name: "repairBill" }, { name: "saleReceipt" }, { name: "buyerCNICPhoto" },
      { name: "saleAgreement" }, { name: "salePhotos" }
    ]));

    const files = req.files;
    const uploadedUrls = {};

    const streamUpload = (file, key) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "bikes", public_id: `${key}_${Date.now()}` },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(file.buffer);
      });
    };

    for (const key in files) {
      if (files[key] && files[key][0]) {
        const uploadResult = await streamUpload(files[key][0], key);
        uploadedUrls[key] = uploadResult.secure_url;
      }
    }

    const formData = JSON.parse(req.body.formData || "{}");

    await addDoc(collection(db, "bikes"), {
      ...formData,
      ...uploadedUrls,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Bike added successfully", data: uploadedUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
