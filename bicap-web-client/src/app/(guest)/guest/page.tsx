export default function GuestPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Welcome Guest</h1>
            <p className="text-lg mb-4">Enter a product code to trace its journey.</p>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Product ID (e.g. PRD-123)"
                    className="border p-2 rounded w-full max-w-sm dark:bg-gray-800 dark:border-gray-700"
                />
                <button className="bg-teal-600 text-white px-4 py-2 rounded">Trace</button>
            </div>
        </div>
    )
}
