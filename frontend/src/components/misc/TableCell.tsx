'use client';
import { alpha, styled } from '@mui/material/styles';


const TableCellWithBorder = styled('td')(({ theme }) => ({
    border : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
    padding: theme.spacing(2),
}));

export default TableCellWithBorder;