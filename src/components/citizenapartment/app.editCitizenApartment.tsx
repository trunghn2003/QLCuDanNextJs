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
import { CitizenApartment, EditCitizenApartmentProps } from "@/type";

// Hàm định dạng ngày chuẩn
const formatDateLocal = (dateString?: string) => {
    if (!dateString) return '';

    const d = new Date(dateString);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();

    return [year, month, day].join('-');
};

export const EditCitizenApartment = ({ citizenApartment, onClose, onUpdate }: EditCitizenApartmentProps) => {
    const queryClient = useQueryClient();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Cập nhật giá trị ngày bắt đầu và kết thúc từ đối tượng `citizenApartment`
    useEffect(() => {
        setStartDate(formatDateLocal(citizenApartment.startDate));
        setEndDate(formatDateLocal(citizenApartment.endDate));
    }, [citizenApartment]);

    const handleSnackbarClose = () => setSnackbarOpen(false);

    // Tạo mutation để cập nhật thông tin `CitizenApartment`
    const mutation = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch(`https://localhost:7199/api/CitizenApartment/${citizenApartment.citizenId}/${citizenApartment.apartmentId}`, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        citizenId: citizenApartment.citizenId,
                        apartmentId: citizenApartment.apartmentId,
                        startDate,
                        endDate
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update citizen apartment.');
                }

                setSnackbarMessage('Citizen apartment updated successfully.');
                setSnackbarOpen(true);
                onUpdate();
                queryClient.invalidateQueries({ queryKey: ['citizenApartments'] });
                onClose(); // Đóng hộp thoại sau khi thành công
            } catch (error) {
                setSnackbarMessage('Failed to update citizen apartment.');
                setSnackbarOpen(true);
            }
        }
    });

    // Gọi hàm mutation để cập nhật thông tin
    const handleUpdate = () => mutation.mutate();

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Edit Citizen Apartment
                <IconButton onClick={onClose} style={{ float: 'right' }}>
                    <CloseIcon color="primary" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} margin={2}>
                    <TextField
                        label="Citizen ID"
                        value={citizenApartment.citizenId}
                        disabled
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Apartment ID"
                        value={citizenApartment.apartmentId}
                        disabled
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="outlined"
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
};
