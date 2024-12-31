// server.js
import Fastify from 'fastify';
import userRouter from './routes/user.js';  // Import as default
import { connectDB } from "./config/database.js";
import dotenv from 'dotenv';
dotenv.config();

const fastify = Fastify({
    logger: true
});
connectDB();  
const registerRoutes = () => {
    fastify.register(userRouter); // Register user routes
};

const startServer = async () => {
    try {
        await fastify.listen(process.env.PORT || 5000, '0.0.0.0'); 
        fastify.log.info(`Server running at ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error('Error starting the server:', err);
        process.exit(1);
    }
};


// Execute all functions to start the application
const init = async () => {
    await connectDB(); 
    registerRoutes();
    await startServer();
};

init();
