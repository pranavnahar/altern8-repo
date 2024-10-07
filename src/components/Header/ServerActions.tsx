"use server";
import { cookies } from "next/headers";

export async function logout() {
  cookies().delete("altern8_useraccess");
  return "success";
}
