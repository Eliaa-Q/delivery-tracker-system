import dotenv from "dotenv";
import express from "express";
import alertsRoutes from "./routes/alerts";
import analyticsRoutes from "./routes/analytics";
import deliveriesRoutes from "./routes/deliveries";
import driversRoutes from "./routes/drivers";
import feedbackRoutes from "./routes/feedbacks";
import jobsRoutes from "./routes/jobs";
import pipelineRoutes from "./routes/pipelines";
import receiversRoutes from "./routes/receivers";
import subscribersRoutes from "./routes/subscribers";
import webhookRoutes from "./routes/webhooks";
import cors from "cors";
import deliveryAttemptsRoutes from "./routes/deliveryAttempts";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
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
app.use("/alerts", alertsRoutes);
app.use("/delivery-attempts", deliveryAttemptsRoutes);
//its route file contains both /pipelines/:id/subscribers and /subscribers/:id
app.use("/", subscribersRoutes);
app.use("/", receiversRoutes);

// Convert to number explicitly
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on port ${PORT}`);
});
