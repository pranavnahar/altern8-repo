"use server";
import { cookies } from "next/headers";

export async function logout() {
  cookies().delete("accessAltern8User");
  return "success";
}
