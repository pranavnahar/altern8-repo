export async function verifyEmail(email: string) {
  if (!email) throw new Error("Email is required");

  try {
    const response = await fetch(`${process.env.SERVER_URL}/email-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to send verification email.");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Email verification failed. Please try again.");
  }
}

export async function verifyOtp(email: string, otp: string) {
  if (!email || !otp) throw new Error("Email and OTP are required");

  try {

    const response = await fetch(`${process.env.SERVER_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to verify OTP.");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "OTP verification failed. Please try again.");
  }
}