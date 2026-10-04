import { apiRequest } from "../../lib/api/client.js";

export const professorService = {
  getDashboard: () => apiRequest("/professor/dashboard"),
  getClasses: () => apiRequest("/professor/classes"),
  getStudents: (options = {}) => {
    const query = new URLSearchParams(options).toString();
    return apiRequest(`/professor/students${query ? `?${query}` : ""}`);
  },
  getAttendance: () => apiRequest("/professor/attendance"),
  getSchedule: () => apiRequest("/professor/schedule"),
};
