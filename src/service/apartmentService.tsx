import { deleteRequest, get, post, put } from "@/util";

export const getApartments = async () => {
    const result = await get("Apartments");
    return result;
  };
export const createApartment = async (data : {}) => {
    const reusult = await post(data, "Apartments")
}
export const editApartment = async (data : {}, id : number ) => {
    const result = await put(`Apartments/${id}`, data);
       return result;
}
export const deleteApartment = async (id: number) => {
    const result = await deleteRequest(`Apartments/${id}`);
       return result;
}
