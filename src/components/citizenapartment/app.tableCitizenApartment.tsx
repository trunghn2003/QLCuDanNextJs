'use client';
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateCitizenApartment } from './app.createCitizenApartment';
import { EditCitizenApartment } from './app.editCitizenApartment';

interface CitizenApartment {
    citizenId: number;
    apartmentId: number;
    startDate: string;
    endDate: string;
}

interface Citizen {
    citizenId: number;
    name: string;
}

interface Apartment {
    apartmentId: number;
    unitNumber: string;
}

const fetchCitizenApartments = async (): Promise<CitizenApartment[]> => {
    const response = await fetch('https://localhost:7199/api/CitizenApartment');
    return response.json();
}

const fetchCitizens = async (): Promise<Citizen[]> => {
    const response = await fetch('https://localhost:7199/api/Citizens');
    return response.json();
}

const fetchApartments = async (): Promise<Apartment[]> => {
    const response = await fetch('https://localhost:7199/api/Apartments');
    return response.json();
}

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function TableCitizenApartment() {
    const queryClient = useQueryClient();
    const [editingCitizenApartment, setEditingCitizenApartment] = useState<CitizenApartment | null>(null);

    const { data: citizenApartments, error, isLoading } = useQuery<CitizenApartment[]>({
        queryKey: ['citizenApartments'],
        queryFn: fetchCitizenApartments
    });
    const { data: apartments} = useQuery({
        queryKey: ['apartments'],
        queryFn: fetchApartments
    });
    const { data: citizens} = useQuery({
        queryKey: ['citizens'],
        queryFn: fetchCitizens
    });
    const deleteMutation = useMutation({
        mutationFn: async ({ citizenId, apartmentId }: { citizenId: number; apartmentId: number }) => {
            const response = await fetch(`https://localhost:7199/api/CitizenApartment/${citizenId}/${apartmentId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete citizen apartment.');
            }
            queryClient.invalidateQueries({queryKey:['citizenApartments']});
        }
    });

    const getCitizenName = (id: number) => citizens?.find(citizen => citizen.citizenId === id)?.name || 'N/A';
    const getUnitNumber = (id: number) => apartments?.find(apartment => apartment.apartmentId === id)?.unitNumber || 'N/A';

    if (isLoading) return <div>Loading...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <CreateCitizenApartment />
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Citizen ID</TableCell>
                            <TableCell>Citizen Name</TableCell>
                            <TableCell>Apartment ID</TableCell>
                            <TableCell>Unit Number</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {citizenApartments?.map((ca) => (
                            <TableRow key={`${ca.citizenId}-${ca.apartmentId}`}>
                                <TableCell>{ca.citizenId}</TableCell>
                                <TableCell>{getCitizenName(ca.citizenId)}</TableCell> {/* Get citizen name */}
                                <TableCell>{ca.apartmentId}</TableCell>
                                <TableCell>{getUnitNumber(ca.apartmentId)}</TableCell> {/* Get unit number */}
                                <TableCell>{formatDate(ca.startDate)}</TableCell>
                                <TableCell>{formatDate(ca.endDate) || 'N/A'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ ml: 1 }}
                                        onClick={() => setEditingCitizenApartment(ca)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ ml: 1 }}
                                        onClick={() => deleteMutation.mutate({ citizenId: ca.citizenId, apartmentId: ca.apartmentId })}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {editingCitizenApartment && (
                <EditCitizenApartment
                    citizenApartment={editingCitizenApartment}
                    onClose={() => setEditingCitizenApartment(null)}
                />
            )}
        </>
    );
}

export default TableCitizenApartment;
