"use server";

import { getUser, updateUser, updateUserRule } from "../services/auth.service";
import { getUserFromToken } from "../util/authTools";
import { CustomError } from "../util/customError";

export const getUserAction = async () => {
  const { email } = await getUserFromToken();
  return await getUser(email);
};

export const updateUserAction = async (data: Pick<User, "firstName" | "lastName" | "email"> & { password: string }) => {
  const { email, firstName, lastName, password } = data;
  const { id } = await getUserFromToken();
  return await updateUser(id, { email, firstName, lastName, password });
};

export async function updateUserRuleAction(id: string, rule: "admin" | "user") {
  if (!id || !rule) return new CustomError("Invalid data to update user rule");

  return await updateUserRule(id, rule);
}
