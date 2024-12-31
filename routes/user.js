import { createUser, loginUser } from "../controllers/userController.js"; 

const userRouter = (fastify, options, done) => {
    fastify.post("/api/users/create", createUser); 
    fastify.post("/api/users/login", loginUser);    
    done();
};

export default userRouter;
