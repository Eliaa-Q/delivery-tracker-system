import {
  getAllAnalytics,
  getAnalyticsByDriverId,
} from "../db/queries/analyticsQueries";

export async function getAllAnalyticsService() {
  return getAllAnalytics();
}

export async function getAnalyticsByDriverIdService(driverId: string) {
  return getAnalyticsByDriverId(driverId);
}
