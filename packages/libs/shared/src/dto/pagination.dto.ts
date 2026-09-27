/**
 * DTO de paginacion de ejemplo. Marca el patron de compartir tipos/DTOs
 * entre apps del monorepo (@template/shared).
 */
export class PaginationDto {
	page?: number;
	limit?: number;
}

export interface Paginated<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}
