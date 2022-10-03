import express from "express";
import "dotenv/config";
import cors from 'cors'
import morgan from "morgan";
import cookieParser from "cookie-parser";
import imageRoutes from "./routes/images.routes.js";
import userRoutes from "./routes/user.routes.js";
import patientRoutes from "./routes/patient.routes.js";

//Initializations
const app = express();
const port = process.env.PORT;

//Middlewares

app.use(express.json());
app.use(cors())
app.use(cookieParser());
app.use(morgan("dev"));

//Routes

app.use(imageRoutes);
app.use("/user", userRoutes);
app.use(patientRoutes);

//Server on port...
app.listen(port, () => {
    console.log(`> Server running on port ${port}`)
});
