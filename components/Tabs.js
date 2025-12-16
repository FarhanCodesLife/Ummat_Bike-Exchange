export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <>
      <div className="flex gap-2 mb-6">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded ${
              activeTab === i ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>{tabs[activeTab].content}</div>
    </>
  );
}
