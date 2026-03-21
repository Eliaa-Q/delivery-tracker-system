import dotenv from "dotenv";
import express from "express";
import analyticsRoutes from "./routes/analytics";
import deliveriesRoutes from "./routes/deliveries";
import driversRoutes from "./routes/drivers";
import feedbackRoutes from "./routes/feedbacks";
import jobsRoutes from "./routes/jobs";
import pipelineRoutes from "./routes/pipelines";
import webhookRoutes from "./routes/webhooks";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/pipelines", pipelineRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/jobs", jobsRoutes);
app.use("/deliveries", deliveriesRoutes);
app.use("/drivers", driversRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/feedback", feedbackRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
