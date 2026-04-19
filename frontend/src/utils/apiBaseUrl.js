const LOCAL_API_BASE_URL = "http://localhost:5000/api";

export const getApiBaseUrl = () => {
  const configuredBaseUrl = process.env.REACT_APP_API_BASE_URL?.trim();

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return LOCAL_API_BASE_URL;
    }
  }

  return configuredBaseUrl || LOCAL_API_BASE_URL;
};
