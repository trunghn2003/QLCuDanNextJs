// CreateCitizenApartment.js
import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Snackbar,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Fetch citizens and apartments from backend APIs
const fetchCitizens = async () => {
    const response = await fetch('https://localhost:7199/api/Citizens');
    return response.json();
}

const fetchApartments = async () => {
    const response = await fetch('https://localhost:7199/api/Apartments');
    return response.json();
}

export const CreateCitizenApartment = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [citizenId, setCitizenId] = useState('');
    const [apartmentId, setApartmentId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    interface Citizen {
        citizenId: number;
        name: string;
    }
    interface Apartment {
        apartmentId: number;
        unitNumber: string;
    }
    // Query to get citizens and apartments
    const { data: apartments} = useQuery({
        queryKey: ['apartments'],
        queryFn: fetchApartments
    });
    const { data: citizens} = useQuery({
        queryKey: ['citizens'],
        queryFn: fetchCitizens
    });

    const openPopup = () => setOpen(true);
    const closePopup = () => setOpen(false);
    const handleSnackbarClose = () => setSnackbarOpen(false);

    const mutation = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch('https://localhost:7199/api/CitizenApartment', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        citizenId: Number(citizenId),
                        apartmentId: Number(apartmentId),
                        startDate,
                        endDate
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to add citizen apartment.');
                }

                setSnackbarMessage('Citizen apartment added successfully.');
                setSnackbarOpen(true);
                // Reset form fields after successful submission
                setCitizenId('');
                setApartmentId('');
                setStartDate('');
                setEndDate('');
                // Refresh the citizen apartments list
                queryClient.invalidateQueries({queryKey: ['citizenApartments']});
            } catch (error) {
                setSnackbarMessage('Failed to add citizen apartment.');
                setSnackbarOpen(true);
            }
        }
    });

    const handleAdd = () => {
        mutation.mutate();
        closePopup();
    }

    return (
        
        <div style={{ textAlign: 'center' }}>
            <Button onClick={openPopup} color='primary' variant='contained'>Add New</Button>
            <Dialog
                open={open}
                onClose={closePopup}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle>
                    Add New Citizen Apartment
                    <IconButton onClick={closePopup} style={{ float: 'right' }}>
                        <CloseIcon color='primary' />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <FormControl fullWidth variant='outlined'>
                            <InputLabel>Citizen</InputLabel>
                            <Select
                                value={citizenId}
                                onChange={(e) => setCitizenId(e.target.value)}
                                label="Citizen"
                            >
                                {citizens?.map((citizen: Citizen) => (
                                    <MenuItem key={citizen.citizenId} value={citizen.citizenId}>
                                        {citizen.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant='outlined'>
                            <InputLabel>Apartment</InputLabel>
                            <Select
                                value={apartmentId}
                                onChange={(e) => setApartmentId(e.target.value)}
                                label="Apartment"
                            >
                                {apartments?.map((apartment: Apartment) => (
                                    <MenuItem key={apartment.apartmentId} value={apartment.apartmentId}>
                                        {apartment.unitNumber}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            variant='outlined'
                            label='Start Date'
                            type='date'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            variant='outlined'
                            label='End Date'
                            type='date'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color='primary' variant='contained' onClick={handleAdd}>Add</Button>
                    <Button color='primary' variant='contained' onClick={closePopup}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
};
