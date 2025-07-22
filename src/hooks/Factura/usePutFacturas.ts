import { usePutFactura as useApiPutFactura } from "@/api/Facturas";
import { Factura } from "@/types/Facturas";

export function usePutFactura() {
  const put = useApiPutFactura();
  const actualizarFactura = async (id: number, data: Partial<Factura>) => put.mutateAsync({ id, ...data });
  return { actualizarFactura };
}
