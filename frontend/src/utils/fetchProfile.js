// utils/fetchProfile.js
import axios from "axios";
import { getApiBaseUrl } from "./apiBaseUrl";

export const fetchProfile = async () => {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await axios.get(`${baseUrl}/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch profile");
  }
};
