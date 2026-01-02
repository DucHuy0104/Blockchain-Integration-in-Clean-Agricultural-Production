export default function RetailerPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Retailer Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Pending Orders</h2>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Low Stock Items</h2>
                    <p className="text-2xl font-bold text-red-500">4</p>
                </div>
            </div>
        </div>
    )
}
