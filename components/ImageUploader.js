export default function ImageUploader({ label, onChange }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
