import 'dotenv/config';
import express from "express";
import connectDB from "./utils/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoute from "./routes/user.route.js";
import stockRoute from "./routes/stock.route.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin: [
        'https://unlisted-stocks.vercel.app',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
    ],
    credentials:true
}

app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use("/api/stock", stockRoute);

app.listen(process.env.PORT || 8000, (err) => {
    if(err){
        console.log("Error in connecting to server: ", err);
    }
    connectDB();
    console.log(`Server is running on port no: ${process.env.PORT}`);
});
