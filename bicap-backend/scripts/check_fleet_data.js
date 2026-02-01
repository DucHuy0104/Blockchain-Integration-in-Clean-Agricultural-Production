const { User, Vehicle } = require('../src/models');
const { connectDB } = require('../src/config/database');

const checkData = async () => {
    try {
        await connectDB();

        const drivers = await User.findAll({ where: { role: 'driver' } });
        const vehicles = await Vehicle.findAll({ include: [{ model: User, as: 'driver' }] });

        console.log(`--- Drivers (${drivers.length}) ---`);
        drivers.forEach(d => console.log(`ID: ${d.id}, Name: ${d.fullName}`));

        console.log(`\n--- Vehicles (${vehicles.length}) ---`);
        vehicles.forEach(v => {
            console.log(`ID: ${v.id}, Plate: ${v.licensePlate}, Driver: ${v.driver ? v.driver.fullName : 'NONE'}`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
};

checkData();
