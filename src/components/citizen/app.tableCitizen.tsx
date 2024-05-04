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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCitizen } from './app.createCitizen';
import { EditCitizen } from './app.editCitizen';

interface Citizen {
    citizenId: number;
    name: string;
    phoneNumber: string;
    email: string;
    dob: string; // The date is sent as a string
}

function fetchCitizens() {
    return fetch('https://localhost:7199/api/Citizens')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

function TableCitizen() {
    const queryClient = useQueryClient();
    const [editingCitizen, setEditingCitizen] = useState<Citizen | null>(null);

    const { mutate } = useMutation({
        mutationFn: async (id: number) => {
            try {
                const response = await fetch(`https://localhost:7199/api/Citizens/${id}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error('Failed to delete citizen.');
                }
                queryClient.invalidateQueries({queryKey: ['citizens']});

            } catch (error) {
                console.log(error);
            }
        }
    });

    const { isFetching, error, data } = useQuery({
        queryKey: ['citizens'],
        queryFn: fetchCitizens
    });

    if (isFetching) return <div>Loading...</div>;
    if (error instanceof Error) return <div>Error occurred: {error.message}</div>;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="citizen table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">ID</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Phone Number</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Date of Birth</TableCell>
                            <TableCell align="right"><CreateCitizen /></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.map((citizen: Citizen) => (
                            <TableRow
                                key={citizen.citizenId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right">{citizen.citizenId}</TableCell>
                                <TableCell align="right">{citizen.name}</TableCell>
                                <TableCell align="right">{citizen.phoneNumber}</TableCell>
                                <TableCell align="right">{citizen.email}</TableCell>
                                <TableCell align="right">{formatDate(citizen.dob)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ ml: 1 }}
                                        onClick={() => setEditingCitizen(citizen)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ ml: 1 }}
                                        onClick={() => mutate(citizen.citizenId)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {editingCitizen && (
                <EditCitizen
                    citizen={editingCitizen}
                    onClose={() => setEditingCitizen(null)}
                />
            )}
        </>
    );
}

export default TableCitizen;
