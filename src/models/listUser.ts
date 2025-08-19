export interface ListUserResult {
    data: ListUserDto[];
    meta: {
        page: number;
        limit: number;
        total: number; 
        totalPages: number;
    }
}

export interface ListUserDto {
    id: number;
    name: string;
    email: string;
    status: string;
}