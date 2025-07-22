import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Factura } from "@/types/Facturas";

export async function putFactura(data: Partial<Factura> & { id: number }): Promise<Factura> {
  const response = await axiosInstance.put(`/facturas/${data.id}`, data);
  return response.data;
}

export function usePutFactura() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putFactura,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
}
