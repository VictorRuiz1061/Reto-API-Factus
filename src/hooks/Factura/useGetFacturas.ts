import { useGetFacturas as useApiGetFacturas } from "@/api/Facturas";

export function useGetFacturas() {
  const { data: facturas = [], isLoading: loading } = useApiGetFacturas();
  return { facturas, loading };
}
