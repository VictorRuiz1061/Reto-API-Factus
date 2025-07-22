import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Factura } from "@/types/Facturas";
import { extractArrayData } from "@/utils/responseHandler";

export async function getFacturas(): Promise<Factura[]> {
  const response = await axiosInstance.get("/bills?filter[identification]&filter[names]&filter[number]&filter[prefix]&filter[reference_code]&filter[status]");
  return extractArrayData<Factura>(response);
}

export function useGetFacturas() {
  return useQuery<Factura[]>({
    queryKey: ["facturas"],
    queryFn: getFacturas,
  });
}
