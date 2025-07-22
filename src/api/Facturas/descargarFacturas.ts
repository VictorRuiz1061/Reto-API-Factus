import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { FacturaDescargaPDFResponse } from "@/types/Facturas";
import { extractObjectData } from "@/utils/responseHandler";

export async function descargarFacturas(number: string): Promise<FacturaDescargaPDFResponse | null> {
  const response = await axiosInstance.get(`/bills/download-pdf/${number}`);
  return extractObjectData<FacturaDescargaPDFResponse>(response);
}

export function useDescargarFacturas(number: string) {
  return useQuery<FacturaDescargaPDFResponse | null>({
    queryKey: ["facturas", number, "descargar"],
    queryFn: () => descargarFacturas(number),
    enabled: !!number, // Solo ejecutar si hay un número
  });
}
