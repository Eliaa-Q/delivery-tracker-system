import { AppError } from "../../../../types";
import { getPipelineById } from "../db/queries/pipelineQueries";
import {
  createSubscriber,
  deleteSubscriberById,
  getSubscriberById,
  getSubscribersByPipelineId,
} from "../db/queries/subscriberQueries";

type CreateSubscriberInput = {
  pipelineId: string;
  name: string;
  targetUrl: string;
};

export async function createSubscriberService(input: CreateSubscriberInput) {
  const pipeline = await getPipelineById(input.pipelineId);

  if (!pipeline) {
    throw new AppError("PIPELINE_NOT_FOUND", "Pipeline not found", 404);
  }

  return createSubscriber({
    pipelineId: input.pipelineId,
    name: input.name,
    targetUrl: input.targetUrl,
  });
}

export async function getSubscribersByPipelineIdService(pipelineId: string) {
  const pipeline = await getPipelineById(pipelineId);

  if (!pipeline) {
    throw new AppError("PIPELINE_NOT_FOUND", "Pipeline not found", 404);
  }

  return getSubscribersByPipelineId(pipelineId);
}

export async function deleteSubscriberByIdService(id: string) {
  const subscriber = await getSubscriberById(id);

  if (!subscriber) {
    throw new AppError("UNKNOWN_ERROR", "Subscriber not found", 404);
  }

  return deleteSubscriberById(id);
}
