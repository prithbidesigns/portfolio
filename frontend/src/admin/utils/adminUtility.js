import { getApiBaseUrl } from "../../utils/apiBaseUrl";

const BASE_URL = getApiBaseUrl();

const parseJsonSafely = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const getNetworkErrorMessage = () =>
  `Cannot reach the API at ${BASE_URL}. Make sure the backend server is running and restart the frontend after env changes.`;

export const handleFileUpload = async (file, folder, retriesLeft = 2) => {
  try {
    const uploadUrl = `${BASE_URL}/uploads/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    if (folder) {
      formData.append("folder", folder);
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    // The free backend host can take 30-50s to wake up from idle — a cold
    // start while it's mid-boot can surface as a gateway error here.
    if (!response.ok && [502, 503, 504].includes(response.status) && retriesLeft > 0) {
      await new Promise((resolve) => setTimeout(resolve, 8000));
      return handleFileUpload(file, folder, retriesLeft - 1);
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || result.message || "Backend upload failed");
    }

    return {
      url: result.url,
      thumbnail: result.thumbnail,
    };
  } catch (error) {
    if (error instanceof TypeError && retriesLeft > 0) {
      await new Promise((resolve) => setTimeout(resolve, 8000));
      return handleFileUpload(file, folder, retriesLeft - 1);
    }
    console.error("Upload error:", error);
    throw error;
  }
};


export const loginRequest = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await parseJsonSafely(response);
    if (!response.ok) throw new Error(data?.message || 'Login failed');
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(getNetworkErrorMessage());
    }
    throw error;
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchData = async (endpoint, token, retriesLeft = 3) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    let response;
    try {
      response = await fetch(`${BASE_URL}/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errData = await parseJsonSafely(response);
      const error = new Error(errData?.message || `Failed to fetch ${endpoint}`);
      if (response.status === 401 && errData?.message && (errData.message.includes("Token expired") || errData.message.includes("Session expired") || errData.message.includes("Token missing"))) {
          error.isAuthError = true;
      }
      throw error;
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    // The free backend host can take 30-50s to wake up from idle, so a
    // cold start looks like a timeout/network error on the first request.
    const isNetworkError = error instanceof TypeError || error.name === "AbortError";
    if (isNetworkError && retriesLeft > 0) {
      await sleep(8000);
      return fetchData(endpoint, token, retriesLeft - 1);
    }
    if (isNetworkError) {
      throw new Error(getNetworkErrorMessage());
    }
    throw error;
  }
};

export const saveData = async (endpoint, data, token, id) => {
  const isEditing = !!id;
  const url = isEditing ? `${BASE_URL}/${endpoint}/${id}` : `${BASE_URL}/${endpoint}`;
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    const result = await parseJsonSafely(response);
    if (!response.ok) {
      const error = new Error(result?.message || 'Failed to save');
      if (response.status === 401 && result?.message && (result.message.includes("Token expired") || result.message.includes("Session expired") || result.message.includes("Token missing"))) {
          error.isAuthError = true;
      }
      throw error;
    }
    return result;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(getNetworkErrorMessage());
    }
    throw error;
  }
};

export const deleteData = async (endpoint, id, token) => {
  const url = id ? `${BASE_URL}/${endpoint}/${id}` : `${BASE_URL}/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const result = await parseJsonSafely(response);
      const error = new Error(result?.message || 'Failed to delete');
      if (response.status === 401 && result?.message && (result.message.includes("Token expired") || result.message.includes("Session expired") || result.message.includes("Token missing"))) {
          error.isAuthError = true;
      }
      throw error;
    }
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(getNetworkErrorMessage());
    }
    throw error;
  }
};
