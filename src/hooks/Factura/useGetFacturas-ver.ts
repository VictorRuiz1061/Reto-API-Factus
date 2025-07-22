import { useGetFacturasVer as useApiGetFacturasVer } from "@/api/Facturas";

export function useGetFacturasVer(number: string) {
  const { data: facturaDetalleResponse = null, isLoading: loading } = useApiGetFacturasVer(number);
  return { data: facturaDetalleResponse, loading };
}
