import { useState } from "react";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import moment from "moment";
import 'moment-timezone';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0a4350',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
const EmailTable = ({ emailList }) => {
    //---Manage table pagination : START---//
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dynamicKey, setDynamicKey] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        if (newPage === 0) {
            setDynamicKey(0);
        } else {
            setDynamicKey(newPage * rowsPerPage);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        setDynamicKey(0);
    };
    //---Manage table pagination : END---//
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">No</StyledTableCell>
                            <StyledTableCell align="left">Address</StyledTableCell>
                            <StyledTableCell align="left">Email</StyledTableCell>
                            <StyledTableCell align="left">Datetime</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {emailList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, key) => (
                                <StyledTableRow key={key}>
                                    <StyledTableCell component="th" scope="row">
                                        {(key + dynamicKey + 1)}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.account && row.account!=='undefined' ? row.account : 'N/A'}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{row.email}</StyledTableCell>
                                    <StyledTableCell align="left">
                                        {moment(row.createdAt).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss a')}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={emailList && emailList?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    )
}

export default EmailTable