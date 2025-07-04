import express from "express"
import dotenv from "dotenv"
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import createHttpError from "http-errors";

// local
import routes from "./routers/index"
import { Request, Response, NextFunction } from "express";

// Load environment variables from .env file
dotenv.config()

// Create Express application instance
const app = express();

// Log incoming requests in development mode (ডিবাগিং ও মনিটরিং সহজ হয়)
if(process.env.NODE_ENV !== "development"){ 
  app.use(morgan("dev")) // লগ ফরম্যাট: 'dev', 'tiny', 'combined', ইত্যাদি
}

// Set secure HTTP headers to protect from common vulnerabilities
app.use(helmet())

// Parse incoming requests with JSON payloads
app.use(express.json())

// Parse incoming requests with URL-encoded payloads (from HTML forms)
app.use(express.urlencoded({ extended: true }))

// Parse cookies from the HTTP Request
app.use(cookieParser())

// Compress response bodies for all requests (improves performance)
app.use(compression())

app.use(cors({ 
  origin:  [process.env.CLIENT_ENDPOINT!],
  credentials: true, // Allow cookies to be sent with requests
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // HTTP methods allowed
  
}))

// console.log for url & method
app.use((req,res,next)=>{ 
  console.log(` url:${req.url}\n method:${req.method}`);
  next()
})

app.use("/api/v1",routes)

app.get("/",(req,res)=>{
  res.send("hello there") 
})



// error for route not exist
app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist."));
});


//error handling
app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

export default app