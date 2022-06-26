import { useState, useEffect, useRef } from "react";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import Loader from '../components/Loader/Loader.js'
import api from "../utils/api";

import moment from "moment";
import 'moment-timezone';
import NoResults from "../components/NoResults.js";

import { setAlert } from "../actions/alert";
import { useDispatch } from 'react-redux';


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


export default function ManageStem() {
    document.title = 'Admin Panel | Stem'

    const [walletAddress, setWalletAddress] = useState('');
    const [fileError, setFileError] = useState('');
    const [loading, setLoading] = useState(false);

    const [nftlist, setNFTlist] = useState([]);

    const dispatch = useDispatch();

    const walletAddressInputChangeHandler = (event) => {
        setFileError('');
        setWalletAddress(event.target.value);
    };

    //On csv upload button click
    const handleGettingNFTs = async () => {
        setFileError('');
        if (walletAddress.length === 0) {
            setFileError('Please input Wallet Address');
            return;
        }

        setNFTlist([]);
        setLoading(true);

        try {
            const response = await api.get(`/stem/getNFTs/${walletAddress}`);
            if (response.status === 200) {
                dispatch(setAlert(response.data.message, "success"));
                setNFTlist(JSON.parse(response.data.result))
            }
        } catch (error) {
            dispatch(setAlert(error.message, "error"));
        } finally {
            setLoading(false);
        }
    };

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

    const handleDeleteAll = async () => {
        try {
            setLoading(true);
            const response = await api.delete(`/stem/clearNFTs`);
            if (response.status === 200) {
                setNFTlist([]);
                dispatch(setAlert(response.data.message, "success"));
            }
        } catch (error) {
            dispatch(setAlert(error.message, "error"));
        } finally {
            setLoading(false);
        }
    }
    //---Manage table pagination : END---//

    return (
        <>
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} sm={6} md={4}>
                        <TextField
                            required
                            id="wallet-address"
                            name="walletAddress"
                            onChange={walletAddressInputChangeHandler}
                            helperText={fileError && fileError}
                            error={fileError ? true : false}
                            sx={{ minWidth: "28vw" }}
                            type='text'
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                        <Button color="secondary" variant="contained" component="span"
                            onClick={handleGettingNFTs}
                        >
                            Get NFTs
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={6}>
                        <div style={{ float: 'right' }}>
                            <Button color="error" variant="contained" component="span"
                                startIcon={<DeleteIcon />}
                                onClick={handleDeleteAll}
                            >
                                Remove All
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Box>

            {
                loading ?
                    <Loader />
                    :
                    <>
                        {nftlist && nftlist.length > 0 ?
                            <>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">Sr No</StyledTableCell>
                                                <StyledTableCell align="left">Name</StyledTableCell>
                                                <StyledTableCell align="left">Image</StyledTableCell>
                                                <StyledTableCell align="left">Animal</StyledTableCell>
                                                <StyledTableCell align="left">DNA</StyledTableCell>
                                                <StyledTableCell align="left">Description</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {nftlist.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, key) => (
                                                    <StyledTableRow key={key}>
                                                        <StyledTableCell component="th" scope="row">
                                                            {(key + dynamicKey + 1)}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">{row.name}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.image}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.animation_url}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.dna}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.description}</StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={nftlist && nftlist?.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </>
                            :
                            <NoResults />
                        }
                    </>
            }
        </>
    );
}
