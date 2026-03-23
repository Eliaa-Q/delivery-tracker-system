import { AppError } from "../../../../types";
import {
  createPipeline,
  deletePipelineById,
  getAllPipelines,
  getPipelineById,
  updatePipelineById,
} from "../db/queries/pipelineQueries";

// Added ': any' to the input parameter
export async function createPipelineService(input: any) {
  return createPipeline(input);
}

export async function getAllPipelinesService() {
  return getAllPipelines();
}

export async function getPipelineByIdService(id: string) {
  const pipeline = await getPipelineById(id);

  if (!pipeline) {
    throw new AppError("PIPELINE_NOT_FOUND", "Pipeline not found", 404);
  }

  return pipeline;
}

// Added ': any' to the input parameter here as well
export async function updatePipelineByIdService(id: string, input: any) {
  const existing = await getPipelineById(id);

  if (!existing) {
    throw new AppError("PIPELINE_NOT_FOUND", "Pipeline not found", 404);
  }

  return updatePipelineById(id, input);
}

export async function deletePipelineByIdService(id: string) {
  const existing = await getPipelineById(id);

  if (!existing) {
    throw new AppError("PIPELINE_NOT_FOUND", "Pipeline not found", 404);
  }

  return deletePipelineById(id);
}
