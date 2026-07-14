/**
 * Contrato genérico de respuesta de API. Marca el patrón de compartir
 * interfaces entre apps del monorepo (@template/interfaces).
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	message?: string;
	errors?: string[];
}
