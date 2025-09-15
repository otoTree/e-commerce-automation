import mongoose from 'mongoose';
import { config } from 'dotenv';
// Load environment variables
config();
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
    throw new Error('MONGO_URL is not defined in environment variables');
}
// Connect to MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});
//# sourceMappingURL=database.js.map