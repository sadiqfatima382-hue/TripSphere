import {  getCustomerDashboardStats,} from "./customer.repository.js";

export async function getCustomerDashboardService(customerId) {
  const stats = await getCustomerDashboardStats(customerId);

  return stats;
}

