import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static("files"));
app.use(cookieParser());

// Routes import
import postGenerateRoute from "./routes/post.routes.ts";

// Routes
app.use("/api/post", postGenerateRoute);

const PORT = process.env.PORT || 3000;
try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error("Error starting server!", error);
}
