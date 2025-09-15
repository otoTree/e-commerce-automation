import express from 'express';
import { config } from 'dotenv';
import { setupMiddleware } from './middleware/index.js';
import apiRoutes from './routes/index.js';
import { startCleanupTask } from './utils/cleanup.js';
import { connectDB } from './config/database.js';
// Load environment variables
config();
// Connect to MongoDB
connectDB();
const app = express();
const PORT = process.env.PORT || 3001;
// Setup middleware
setupMiddleware(app);
// Setup routes
app.use('/', apiRoutes);
app.use('/api', apiRoutes);
// Start cleanup task for expired extensions
startCleanupTask();
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Extension registration endpoint: POST /api/extension/register');
    console.log('Task creation endpoint: POST /api/tasks/create');
});
export default app;
//# sourceMappingURL=index.js.map