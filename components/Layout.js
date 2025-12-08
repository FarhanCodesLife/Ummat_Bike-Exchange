export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Used Bike Management App</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
