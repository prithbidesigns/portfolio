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

export const handleFileUpload = async (file, folder) => {
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

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Backend upload failed");
    }

    return {
      url: result.url,
      thumbnail: result.thumbnail,
    };
  } catch (error) {
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

export const fetchData = async (endpoint, token) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
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
    if (error instanceof TypeError) {
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
