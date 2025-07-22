import { useDescargarFacturas as useApiDescargarFacturas } from "@/api/Facturas";

export function useDescargarFacturas(number: string) {
  const { data: facturaDetalleResponse = null, isLoading: loading } = useApiDescargarFacturas(number);
  return { data: facturaDetalleResponse, loading };
}
