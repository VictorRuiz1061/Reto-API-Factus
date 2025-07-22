import { usePostFactura as useApiPostFactura } from "@/api/Facturas";
import { FacturaCreateRequest } from "@/types/Facturas";

export function usePostFactura() {
  const post = useApiPostFactura();
  const crearFactura = async (data: FacturaCreateRequest) => post.mutateAsync(data);
  return { crearFactura };
}