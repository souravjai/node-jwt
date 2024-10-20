const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const mongodb_url = process.env.MONGODB_URL || 'mongod://localhost:27017'
const dbName = process.env.DB_NAME || 'user_auth';

mongoose.connect(mongodb_url, { dbName })
    .then(() => {
        console.log(`Connected to ${dbName}`);
    })
    .catch((err) => {
        console.error(err);
    });

mongoose.connection.on('error', (err) => {
    console.error(err);
})

mongoose.connection.on('disconnected', () => {
    console.log("Disconnected from DB");
})


process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
})