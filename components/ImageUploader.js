"use client";
import { useState, useEffect } from "react";

export default function ImageUploader({ label, onChange, existingUrl }) {
  const [preview, setPreview] = useState("");

  // If existing image comes from Firestore → set preview
  useEffect(() => {
    if (existingUrl) {
      setPreview(existingUrl);
    }
  }, [existingUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // live preview
    }
    onChange(e); // send file to parent
  };

  return (
    <div className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <label className="font-semibold">{label}</label>

        {preview ? (
          <span className="text-green-600 font-semibold text-sm">Uploaded ✔</span>
        ) : (
          <span className="text-red-600 font-semibold text-sm">Missing ✘</span>
        )}
      </div>

      {/* Image Preview */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="h-28 w-28 object-cover rounded border mt-2"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mt-2"
      />
    </div>
  );
}
