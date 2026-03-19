import dotenv from "dotenv";
import express from "express";
import deliveriesRoutes from "./routes/deliveries";
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
