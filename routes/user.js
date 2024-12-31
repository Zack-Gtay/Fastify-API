import { createUser, loginUser } from "../controllers/userController.js";  // Import the controller functions

const userRouter = (fastify, options, done) => {
    fastify.post("/api/users/create", createUser);  // Use the controller for handling the create user request
    fastify.post("/api/users/login", loginUser);    // Use the controller for handling the login request
    done();
};

export default userRouter;
