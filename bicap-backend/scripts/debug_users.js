const { User, Farm } = require('../src/models');
const { connectDB } = require('../src/config/database');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await connectDB();
        const users = await User.findAll();
        console.log('--- USER LIST ---');
        users.forEach(u => {
            console.log(`ID: ${u.id} | Email: ${u.email} | Role: ${u.role} | FirebaseUID: ${u.firebaseUid}`);
        });
        console.log('-----------------');

        const farms = await Farm.findAll();
        console.log('--- FARM LIST ---');
        farms.forEach(f => {
            console.log(`ID: ${f.id} | Name: ${f.name} | OwnerId: ${f.ownerId}`);
        });
        console.log('-----------------');
    } catch (error) {
        console.error('Error checking users:', error);
    }
};

checkUsers();
