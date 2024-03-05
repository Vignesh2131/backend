import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({ limit: "16kb" }))//request for data from form

app.use(express.urlencoded({ extended: true, limit: "16kb" })) // request for data from url

app.use(express.static("public"))

app.use(cookieParser())


//routes imports//
import userRouter from "./routes/user.routes.js";


//routes declaration
app.use("/api/v1/users", userRouter) //Url : http://localhost:8000/api/v1/users/register


export {app}