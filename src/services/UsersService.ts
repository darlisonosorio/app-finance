import BaseService from "host/BaseService";
import type { ListUserResult } from "../models/listUser";

const usersService = new BaseService("/users");

export async function fetchUsers(page: number, limit: number, search: string = ''): Promise<ListUserResult> {
  return (await usersService.get("/", { params: { page, limit, search } })).data;
}
