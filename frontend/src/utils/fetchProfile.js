// utils/fetchProfile.js
import axios from "axios";
import { getApiBaseUrl } from "./apiBaseUrl";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchProfile = async (retriesLeft = 3) => {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await axios.get(`${baseUrl}/profile`, { timeout: 20000 });
    return response.data;
  } catch (error) {
    // The free backend host can take 30-50s to wake up from idle, so a
    // cold start looks like a timeout/network error on the first request.
    if (retriesLeft > 0) {
      await sleep(8000);
      return fetchProfile(retriesLeft - 1);
    }
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch profile");
  }
};
