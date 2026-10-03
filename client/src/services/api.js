const BASE_URL = "/api";

export const getToken = () => localStorage.getItem("token");
export const isLoggedIn = () => !!getToken();

export const saveSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// One helper for all requests. Throws an Error with the server's message.
async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(BASE_URL + path, { ...options, headers });
  } catch (err) {
    throw new Error("Cannot connect to the server. Is the backend running?");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Expired/invalid token: clear session so the user logs in again
    if (response.status === 401 && token) {
      clearSession();
    }
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
}

export const signupUser = (form) =>
  request("/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

export const loginUser = (form) =>
  request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

export const analyzeResume = (formData) =>
  request("/analyze", { method: "POST", body: formData });

export const fetchAnalyses = () => request("/analyses");
export const fetchAnalysis = (id) => request(`/analyses/${id}`);
