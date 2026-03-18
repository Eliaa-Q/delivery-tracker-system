import {
  createPipeline,
  deletePipelineById,
  getAllPipelines,
  getPipelineById,
} from "../db/queries/pipelineQueries";
import { PipelineAction } from "../../../../types";

type CreatePipelineInput = {
  name: string;
  sourcePath: string;
  actionType: PipelineAction;
  actionConfig?: Record<string, unknown> | null;
};

export async function createPipelineService(input: CreatePipelineInput) {
  return createPipeline({
    name: input.name,
    sourcePath: input.sourcePath,
    actionType: input.actionType,
    actionConfig: input.actionConfig ?? null,
  });
}

export async function getAllPipelinesService() {
  return getAllPipelines();
}

export async function getPipelineByIdService(id: string) {
  return getPipelineById(id);
}

export async function deletePipelineByIdService(id: string) {
  return deletePipelineById(id);
}
