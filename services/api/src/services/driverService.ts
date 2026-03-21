import { AppError } from "../../../../types";
import { getAllDrivers, getDriverById } from "../db/queries/driverQueries";

export async function getAllDriversService() {
  return getAllDrivers();
}

export async function getDriverByIdService(id: string) {
  const driver = await getDriverById(id);

  if (!driver) {
    throw new AppError("JOB_PROCESSING_FAILED", "Driver not found", 404);
  }

  return driver;
}
