import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/bike/add" className="bg-blue-600 text-white p-4 rounded text-center font-medium hover:bg-blue-700">
          Add New Bike
        </Link>
        <Link href="/bike" className="bg-green-600 text-white p-4 rounded text-center font-medium hover:bg-green-700">
          View Bikes
        </Link>
      </div>
    </Layout>
  );
}
