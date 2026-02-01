const { Vehicle } = require('../src/models');
const { connectDB } = require('../src/config/database');

const checkOwners = async () => {
    try {
        await connectDB();
        const vehicles = await Vehicle.findAll();
        console.log("--- Vehicle Ownership ---");
        vehicles.forEach(v => {
            console.log(`ID: ${v.id}, Plate: ${v.licensePlate}, OwnerId: ${v.ownerId}`);
        });
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

checkOwners();
