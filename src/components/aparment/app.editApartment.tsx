import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Select,
    MenuItem,
    Snackbar
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editApartment } from '@/service/apartmentService';
import { getCitizens } from '@/service/citizenService';
import { Apartment, Citizen, CitizenApartment } from '@/type';
import { getCitizenApartments, getCitizenApartmentsByApartmentId } from '@/service/citizenApartmentService';
import { EditCitizenApartment } from '../citizenapartment/app.editCitizenApartment';



interface CitizenWithDetails extends CitizenApartment, Citizen { }

interface EditApartmentProps {
    apartment: Apartment;
    onClose: () => void;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'; // Handle undefined or empty input
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export const EditApartment = ({ apartment, onClose }: EditApartmentProps) => {
    const [unitNumber, setUnitNumber] = useState(apartment.unitNumber);
    const [floor, setFloor] = useState(apartment.floor);
    const [size, setSize] = useState(apartment.size);
    const [citizenDetails, setCitizenDetails] = useState<CitizenWithDetails[]>([]);
    const [allCitizens, setAllCitizens] = useState<Citizen[]>([]);
    const [selectedCitizen, setSelectedCitizen] = useState<number | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const queryClient = useQueryClient();
    const [editingCitizenApartment, setEditingCitizenApartment] = useState<CitizenApartment | null>(null);


    // Mutation for editing the apartment
    const { mutate: editMutate } = useMutation({
        mutationFn: async () => {
            await editApartment({ unitNumber, floor, size }, apartment.apartmentId);
            queryClient.invalidateQueries({ queryKey: ['apartments'] });
            onClose();
        }
    });

    // Mutation for adding a citizen to an apartment
    const { mutate: addCitizenMutate } = useMutation({
        mutationFn: async () => {
            if (selectedCitizen) {
                const data = {
                    citizenId: selectedCitizen,
                    apartmentId: apartment.apartmentId,
                    startDate,
                    endDate
                };
                const response = await fetch('https://localhost:7199/api/CitizenApartment', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) {
                    setSnackbarMessage('Failed to add citizen to apartment.');
                    setSnackbarOpen(true);
                    return;
                }
                fetchCitizenApartmentsWithDetails();

                setSnackbarMessage('Citizen added to apartment successfully.');
                setSnackbarOpen(true);
                // Clear form fields after successful submission
                setSelectedCitizen(null);
                setStartDate('');
                setEndDate('');
            }
        }
    });

    // Fetch citizen-apartment associations and join with citizen details
    const fetchCitizenApartmentsWithDetails = async () => {
        try {
            const citizenApartments: CitizenApartment[] = await getCitizenApartmentsByApartmentId(apartment.apartmentId)
            const allCitizenData = await getCitizens();
            const details: CitizenWithDetails[] = citizenApartments.map(ca => {
                const citizen = allCitizenData.find((c: Citizen) => c.citizenId === ca.citizenId) || {
                    name: '',
                    phoneNumber: '',
                    email: ''
                };
                return {
                    ...citizen,
                    ...ca
                };
            });
            setCitizenDetails(details);
        } catch (error) {
            setCitizenDetails([]);
        }
    };

    // Fetch all available citizens
    const fetchAllCitizens = async () => {
        try {
            const result = await getCitizens();
            setAllCitizens(result || []);
        } catch (error) {
            setAllCitizens([]);
        }
    };
    const deleteMutation = useMutation({
        mutationFn: async ({ citizenId, apartmentId }: { citizenId: number; apartmentId: number }) => {
            const response = await fetch(`https://localhost:7199/api/CitizenApartment/${citizenId}/${apartmentId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete citizen apartment.');
            }
            fetchCitizenApartmentsWithDetails();
        }
    });

    useEffect(() => {
        fetchCitizenApartmentsWithDetails();
        fetchAllCitizens();
    }, [apartment.apartmentId]);

    const handleUpdate = () => editMutate();
    const handleAddCitizen = () => addCitizenMutate();
    const handleSnackbarClose = () => setSnackbarOpen(false);

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Apartment</DialogTitle>
            <DialogContent>
                <TextField label="Apartment Name" value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} fullWidth margin="normal" />
                <TextField label="Floor" type="number" value={floor} onChange={(e) => setFloor(Number(e.target.value))} fullWidth margin="normal" />
                <TextField label="Size" type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} fullWidth margin="normal" />

                <Typography variant="h6">Current Citizens</Typography>
                {citizenDetails.length === 0 ? (
                    <Typography>No citizens found</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {citizenDetails.map((citizen) => (
                                <TableRow key={citizen.citizenId}>
                                    <TableCell>{citizen.name}</TableCell>
                                    <TableCell>{citizen.phoneNumber}</TableCell>
                                    <TableCell>{citizen.email}</TableCell>
                                    <TableCell>{(formatDate(citizen.startDate)) || 'N/A'}</TableCell>
                                    <TableCell>{(formatDate(citizen.endDate)) || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ ml: 1 }}
                                            onClick={() => setEditingCitizenApartment(citizen)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            sx={{ ml: 1 }}
                                            onClick={() => deleteMutation.mutate({ citizenId: citizen.citizenId, apartmentId: citizen.apartmentId })}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                <Typography variant="h6">Add Existing Citizen</Typography>
                <Select
                    value={selectedCitizen ?? ''}
                    onChange={(e) => setSelectedCitizen(Number(e.target.value))}
                    fullWidth
                    displayEmpty
                >
                    <MenuItem value="" disabled>Select Citizen</MenuItem>
                    {allCitizens.map((citizen) => (
                        <MenuItem key={citizen.citizenId} value={citizen.citizenId}>
                            {citizen.name}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Button onClick={handleAddCitizen} color="primary" variant="contained" style={{ marginTop: '1rem' }}>Add Citizen</Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdate} color="primary" variant="contained">Update</Button>
                <Button onClick={onClose} color="secondary" variant="contained">Cancel</Button>
            </DialogActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
            {editingCitizenApartment && (
                <EditCitizenApartment
                    citizenApartment={editingCitizenApartment}
                    onClose={() => setEditingCitizenApartment(null)}
                    onUpdate={() => fetchCitizenApartmentsWithDetails()} 
                />
            )}
        </Dialog>

    );
};
