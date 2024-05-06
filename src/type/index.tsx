export interface Apartment {
    apartmentId: number;
    unitNumber: string;
    floor: number;
    size: number;
}


export interface Citizen {
    citizenId: number;
    name: string;
    phoneNumber: string;
    email: string;
    dob: string; // The date is sent as a string
}

export interface CitizenApartment {
    citizenId: number;
    apartmentId: number;
    startDate: string;
    endDate: string;
}
interface EditApartmentProps {
    apartment: Apartment;
    onClose: () => void;
}

export interface EditCitizenApartmentProps {
    citizenApartment: CitizenApartment
    onClose: () => void;
    onUpdate: () => void;
}


