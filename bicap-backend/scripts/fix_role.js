const { User } = require('../src/models');
const { connectDB } = require('../src/config/database');
require('dotenv').config();

const fixShippingRole = async () => {
    try {
        await connectDB();
        const user = await User.findOne({ where: { email: 'shipping@test.com' } });

        if (user) {
            console.log(`Current Role: ${user.role}`);
            user.role = 'shipping'; // Update to Manager
            await user.save();
            console.log(`✅ Updated shipping@test.com to role 'shipping'`);
        } else {
            console.log("User not found");
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

fixShippingRole();
