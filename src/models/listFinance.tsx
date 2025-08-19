
export interface ListFinanceResult {
  data: ListFinanceDto[];
  meta: {
    page: number;
    limit: number;
    total: number; 
    totalPages: number;
  }
}

export interface ListFinanceDto {
  id: number;
  user_id: number;
  value: string;
  description: string;
}