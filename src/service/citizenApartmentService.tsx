import { deleteRequest, get, post, put } from "@/util";

export const getCitizenApartments = async () => {
    const result = await get("CitizenApartment");
    return result;
  };
export const getCitizenApartmentsByApartmentId = async (id: number) => {
    const result = await get(`CitizenApartment/CitizensByApartment/${id}`);
    return result;
  };

