import BaseService from "host/BaseService";
import type { ListFinanceResult } from '../models/listFinance';
import type { Finance } from "../models/finance";
import type { FinanceForm } from "../models/financeForm";

const financeService = new BaseService("/finance");

export async function fetchFinances(page: number, limit: number, search: string = ''): Promise<ListFinanceResult> {
  return (await financeService.get("/", { params: { page, limit, search } })).data;
}

export async function getFinance(id: number): Promise<Finance> {
  return (await financeService.get(`/${id}`)).data;
}

export async function deleteFinance(id: number): Promise<void> {
  await financeService.delete(`/${id}`);
}

export async function createFinance(financeForm: FinanceForm): Promise<number> {
  const response =  await financeService.post('/', financeForm);
  
  if (response.status < 200 || response.status > 305) {
    throw new Error(response.data?.message || 'Erro na requisição');
  }

  return response.data;
}

export async function updateFinance(id: number, financeForm: FinanceForm): Promise<void> {
  const response = await financeService.put(`/${id}`, financeForm);
  
  if (response.status < 200 || response.status > 305) {
    throw new Error(response.data?.message || 'Erro na requisição');
  }

  return response.data;
}
