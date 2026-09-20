export const getHealthStatus = () => {
  return {
    status: "ok",
    service: "student-career-planner-server",
    timestamp: new Date().toISOString(),
  };
};