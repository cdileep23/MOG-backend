import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";

import connectDB from "./db";

import { loadData } from "./utils/load";
import { limiter } from "./utils/rateLimit";
import { router } from "./route/chapter.route";

const app = express();

app.use(express.json());
app.use(limiter)
app.use("/api/v1/chapters", router);
app.get("/", (req: Request, response: Response) => {
  response.send("Hello from MathonGo Backend");
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(4545, () => {
      console.log("✅ Server Started At 4545");
    });

  
  } catch (error) {
    console.log(error);
  }
};
startServer();
