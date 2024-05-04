// app.editApartment.tsx
import React, { useState } from 'react';
import { Apartment } from '@/type';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editApartment } from '@/service/apartmentService';
interface EditApartmentProps {
    apartment: Apartment
    onClose: () => void;
}

export const EditApartment = ({ apartment, onClose }: EditApartmentProps) => {
    const [unitNumber, setUnitNumber] = useState(apartment.unitNumber);
    const [floor, setFloor] = useState(apartment.floor);
    const [size, setSize] = useState(apartment.size);
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: async () => {
            const response = await editApartment({ unitNumber, floor, size }, apartment.apartmentId)
            queryClient.invalidateQueries({queryKey: ['apartments']});
            onClose();
        }
    });

    const handleUpdate = () => mutate();

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Apartment</DialogTitle>
            <DialogContent>
                <TextField label="Unit Number" value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} fullWidth margin="normal" />
                <TextField label="Floor" type="number" value={floor} onChange={(e) => setFloor(Number(e.target.value))} fullWidth margin="normal" />
                <TextField label="Size" type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} fullWidth margin="normal" />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUpdate} color="primary" variant="contained">Update</Button>
                <Button onClick={onClose} color="secondary" variant="contained">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
