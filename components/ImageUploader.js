"use client";
import { useState, useEffect } from "react";

export default function ImageUploader({
  label,
  onChange,
  existingUrl,
  currentFile, // 🔴 VERY IMPORTANT
  required = false,
}) {
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");

  /* ---------- EXISTING IMAGE (EDIT MODE) ---------- */
  useEffect(() => {
    if (existingUrl) {
      setPreview(existingUrl);
      setFileName("Saved Image");
    }
  }, [existingUrl]);

  /* ---------- CURRENT FILE (TAB SWITCH FIX) ---------- */
  useEffect(() => {
    if (currentFile instanceof File) {
      const url = URL.createObjectURL(currentFile);
      setPreview(url);
      setFileName(currentFile.name);

      return () => URL.revokeObjectURL(url);
    }

    if (!currentFile && !existingUrl) {
      setPreview("");
      setFileName("");
    }
  }, [currentFile, existingUrl]);

  /* ---------- HANDLE FILE ---------- */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);

    onChange(e); // send file to parent
  };

  /* ---------- REMOVE IMAGE ---------- */
  const removeImage = () => {
    setPreview("");
    setFileName("");

    const input = document.getElementById(`file-${label}`);
    if (input) input.value = "";

    onChange({ target: { files: [] } });
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <label className="font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {preview ? (
          <span className="text-green-600 text-xs font-bold">Uploaded ✔</span>
        ) : (
          <span className="text-red-500 text-xs font-bold">Missing ✘</span>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative w-32 h-32 mb-3">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <input
        id={`file-${label}`}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />

      {/* Filename */}
      {fileName && (
        <p className="mt-1 text-xs text-gray-500 truncate">{fileName}</p>
      )}
    </div>
  );
}
