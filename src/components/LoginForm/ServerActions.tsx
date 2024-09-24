"use server";
import { cookies } from "next/headers";
import UserCredentials from "./LoginForm";

export async function create(formFields: typeof UserCredentials) {
  cookies().set("accessAltern8User", JSON.stringify(formFields));
  return "success";
}
