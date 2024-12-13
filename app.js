import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// app.get('/', (req,res) => {
//     res.send("hello world");
// });

app.use("/user", userRouter)

export {app};