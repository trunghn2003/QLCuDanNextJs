'use client'
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EditApartment } from './app.editApartment'; // Assuming you have an edit form
import { CreateApartment } from './app.createApartment';
import { deleteApartment, getApartments } from '@/service/apartmentService';
import {Apartment} from "@/type/index";


const fetchApartments = async() => {
    const result = await getApartments()
    return result;
   
}

function TableApartment() {
    const queryClient = useQueryClient();
    const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);

    const { data: apartments, error, isLoading } = useQuery({
        queryKey: ['apartments'],
        queryFn: fetchApartments
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await deleteApartment(id);
            queryClient.invalidateQueries({queryKey: ['apartments']});
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Floor</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell><CreateApartment /></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apartments?.map((apartment : Apartment) => (
                            <TableRow key={apartment.apartmentId}>
                                <TableCell>{apartment.apartmentId}</TableCell>
                                <TableCell>{apartment.unitNumber}</TableCell>
                                <TableCell>{apartment.floor}</TableCell>
                                <TableCell>{apartment.size}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ ml: 1 }}
                                        onClick={() => setEditingApartment(apartment)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ ml: 1 }}
                                        onClick={() => deleteMutation.mutate(apartment.apartmentId)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {editingApartment && (
                <EditApartment
                    apartment={editingApartment}
                    onClose={() => setEditingApartment(null)}
                />
            )}
        </>
    );
}

export default TableApartment;
