import { deleteRequest, get, post, put } from "@/util";

export const getCitizens = async () => {
    const result = await get("Citizens");
    return result;
  };
export const createCitizen = async (data : {}) => {
    const reusult = await post(data, "Citizens")
}
export const editCitizen = async (data : {}, id : number ) => {
    const result = await put(`Citizens/${id}`, data);
       return result;
}
export const deleteCitizen = async (id: number) => {
    const result = await deleteRequest(`Citizens/${id}`);
       return result;
}
