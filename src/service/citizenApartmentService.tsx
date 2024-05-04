import { deleteRequest, get, post, put } from "@/util";

export const getCitizenApartments = async () => {
    const result = await get("CitizenApartment");
    return result;
  };
