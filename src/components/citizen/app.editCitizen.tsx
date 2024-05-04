import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editCitizen } from "@/service/citizenService";
import { Citizen } from "@/type";

interface EditCitizenProps {
    citizen: Citizen
    onClose: () => void;
}

export const EditCitizen = ({ citizen, onClose }: EditCitizenProps) => {
    const queryClient = useQueryClient();
    const [name, setName] = useState(citizen.name);
    const [dob, setDob] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(citizen.phoneNumber);
    const [email, setEmail] = useState(citizen.email);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        // Ensure no date discrepancy occurs
        const localDate = new Date(citizen.dob);
        const formattedDate = localDate.toLocaleDateString('en-CA'); // `en-CA` provides the `YYYY-MM-DD` format
        setDob(formattedDate);
    }, [citizen.dob]);

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const { mutate } = useMutation({
        mutationFn: async () => {
            try {
                const response = await editCitizen({ name, dob, phoneNumber, email }, citizen.citizenId)
                setSnackbarMessage('Citizen updated successfully.');
                setSnackbarOpen(true);
                queryClient.invalidateQueries({queryKey: ['citizens']});

                onClose(); // Close the dialog on success
            } catch (error) {
                setSnackbarMessage('Failed to update citizen.');
                setSnackbarOpen(true);
            }
        }
    });

    const handleUpdate = () => mutate();

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Edit Citizen
                <IconButton onClick={onClose} style={{ float: 'right' }}>
                    <CloseIcon color="primary" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} margin={2}>
                    <TextField
                        variant="outlined"
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        label="Date of Birth"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        variant="outlined"
                        label="Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant="contained" onClick={handleUpdate}>Update</Button>
                <Button color="primary" variant="contained" onClick={onClose}>Cancel</Button>
            </DialogActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Dialog>
    );
}
