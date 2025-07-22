import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosConfig";
import { Municipio } from "@/types/Municipio";
import { extractArrayData } from "@/utils/responseHandler";

export async function getMunicipios(): Promise<Municipio[]> {
  const response = await axiosInstance.get("/municipalities?name=");
  return extractArrayData<Municipio>(response);
}

export function useGetMunicipios() {
  return useQuery<Municipio[]>({
    queryKey: ["municipios"],
    queryFn: getMunicipios,
  });
}
