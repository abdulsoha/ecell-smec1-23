// src/api.ts
const API_BASE_URL = "http://localhost:5000"; // change to ngrok/Render URL in prod

export const createOrder = async (payload: any) => {
  const res = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};
