export default function ShippingPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Shipping Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Active Shipments</h2>
                    <p className="text-2xl font-bold text-orange-600">8</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Available Drivers</h2>
                    <p className="text-2xl font-bold text-green-600">3</p>
                </div>
            </div>
        </div>
    )
}
