const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const verifyEmail = async (email: string) => {
  if (!email) throw new Error("Email is required");

  const response = await fetch(`${API_BASE_URL}/email-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to send verification email.");
  }

  return data;
};

export const verifyOtp = async (email: string, otp: string) => {
  if (!email || !otp) throw new Error("Email and OTP are required");

  const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to verify OTP.");
  }

  return data;
};