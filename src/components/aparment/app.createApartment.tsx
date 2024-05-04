import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const CreateApartment = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [unitNumber, setUnitNumber] = useState('');
    const [floor, setFloor] = useState('');
    const [size, setSize] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const openPopup = () => setOpen(true);
    const closePopup = () => setOpen(false);
    const handleSnackbarClose = () => setSnackbarOpen(false);

    const { mutate } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch('https://localhost:7199/api/Apartments', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ unitNumber, floor: Number(floor), size: Number(size) })
                });

                if (!response.ok) {
                    throw new Error('Failed to add apartment.');
                }

                setSnackbarMessage('Apartment added successfully.');
                setSnackbarOpen(true);
                // Reset form fields after successful submission
                setUnitNumber('');
                setFloor('');
                setSize('');
                // Refresh the apartment list
                queryClient.invalidateQueries({ queryKey: ['apartments'] });

            } catch (error) {
                setSnackbarMessage('Failed to add apartment.');
                setSnackbarOpen(true);
            }
        }
    });

    const handleAdd = () => {
        mutate();
        closePopup();
    };

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
                    Add New Apartment
                    <IconButton onClick={closePopup} style={{ float: 'right' }}>
                        <CloseIcon color='primary' />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField
                            variant='outlined'
                            label='Unit Number'
                            value={unitNumber}
                            onChange={(e) => setUnitNumber(e.target.value)}
                        />
                        <TextField
                            variant='outlined'
                            label='Floor'
                            type='number'
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                        />
                        <TextField
                            variant='outlined'
                            label='Size'
                            type='number'
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
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
