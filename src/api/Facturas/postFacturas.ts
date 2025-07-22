import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { FacturaCreateRequest, FacturaCreateResponse } from "@/types/Facturas";

export async function postFactura(data: FacturaCreateRequest): Promise<FacturaCreateResponse> {
  const response = await axiosInstance.post("/bills/validate", data);
  return response.data;
}

export function usePostFactura() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postFactura,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
}
