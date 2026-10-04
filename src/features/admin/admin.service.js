import { apiRequest } from "../../lib/api/client.js";

export const adminService = {
  getDashboard: () => apiRequest("/admin/dashboard"),
  listStudents: (options = {}) => {
    const query = new URLSearchParams(options).toString();
    return apiRequest(`/admin/students${query ? `?${query}` : ""}`);
  },
  createStudent: (student) => apiRequest("/admin/students", {
    method: "POST",
    body: student,
  }),
  getFinance: () => apiRequest("/admin/finance"),
  getAttendance: () => apiRequest("/admin/attendance"),
  getEquipment: () => apiRequest("/admin/equipment"),
  getSettings: () => apiRequest("/admin/settings"),
  updateSettings: (settings) => apiRequest("/admin/settings", {
    method: "PUT",
    body: settings,
  }),
};
