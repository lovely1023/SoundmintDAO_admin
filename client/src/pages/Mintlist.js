import { useState, useEffect } from "react";

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
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import Loader from '../components/Loader/Loader.js'
import api from "../utils/api";

import moment from "moment";
import 'moment-timezone';
import NoResults from "../components/NoResults.js";

import { setAlert } from "../actions/alert";
import { useDispatch } from 'react-redux';
import SwitchProgress from "../components/SwitchProgress.js";


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


export default function Mintlist() {
    document.title = 'Admin Panel | Mintlist'

    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [fileError, setFileError] = useState('');
    const [loading, setLoading] = useState(true);
    const [merklerootLoading, setMerklerootLoading] = useState(false);
    const [merkleroot, setMerkleroot] = useState('');

    const [mintlist, setMintlist] = useState([]);

    const dispatch = useDispatch()

    //To remove single address
    const handleDeleteAddress = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const body = { data: { _id: id } }
                const response = await api.delete("/mintlist/deleteMintAddress", body);
                if (response.status === 200) {
                    setMintlist(response.data);
                    dispatch(setAlert('Mint address successfully deleted', "success"));
                }

            } catch (error) {
                dispatch(setAlert(error.message, "error"));
            } finally {
                setLoading(false);
            }
        }
    }

    //To remove all addresses
    const handleDeleteAll = async (id) => {
        if (window.confirm('Are you sure you want to delete all addresses?')) {
            try {
                setLoading(true);
                const response = await api.delete("/mintlist/deleteAllMintAddresses");
                if (response.status === 200) {
                    setMintlist([]);
                    dispatch(setAlert(response.data.message, "success"));
                }
            } catch (error) {
                dispatch(setAlert(error.message, "error"));
            } finally {
                setLoading(false);
            }
        }
    }

    const csvInputChangeHandler = (event) => {
        setFileError('');
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    //On csv upload button click
    const handleCsvSubmission = async () => {

        setFileError('');
        if (!isFilePicked) {
            setFileError('Please select a csv file');
            return;
        } else if (selectedFile.type !== 'text/csv') {
            setFileError('Only csv file allowed');
            return;
        }

        setMintlist([]);
        setLoading(true);

        try {
            let bodyData = new FormData();
            bodyData.append('csvFile', selectedFile);
            const response = await api.post("/mintlist/uploadMint", bodyData);
            if (response.status === 200) {
                await getAllMintlist();
                dispatch(setAlert(response.data.message, "success"));
            }
        } catch (error) {
            dispatch(setAlert(error.message, "error"));
            setLoading(false);
        } finally {
            document.getElementById("id-address").value = "";
            setSelectedFile(null);
            setIsFilePicked(false);
        }
    };

    const getMerkleRoot = async () => {
        try {
            setMerklerootLoading(true);
            const response = await api.get("/mintlist/getMerkleRoot");
            if (response.status === 200 && response.data.isMerkleRoot) {
                setMerkleroot(response.data.merkleRoot);
                navigator.clipboard.writeText(response.data.merkleRoot);
                dispatch(setAlert('Merkleroot copied to clipboard', "info"));
                //after 10 s hide merkleroot
                setTimeout(
                    () => setMerkleroot(''),
                    10000
                );
            }
        } catch (error) {
            dispatch(setAlert(error.message, "error"));
        } finally {
            setMerklerootLoading(false);
        }
    }

    //To get all mint list 
    const getAllMintlist = async () => {
        try {
            setLoading(true);
            const response = await api.get("/mintlist/getAllAllowed");
            if (response.status === 200) {
                setMintlist(response.data);
            }
        } catch (error) {
            dispatch(setAlert(error.message, "error"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllMintlist();
    }, [])

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
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4} sm={6} md={4}>
                        <TextField
                            required
                            id="id-address"
                            name="csvFile"
                            inputProps={{
                                accept:
                                    ".csv",
                            }}
                            onChange={csvInputChangeHandler}
                            helperText={fileError && fileError}
                            error={fileError ? true : false}
                            type='file'
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                        <Button color="secondary" variant="contained" component="span"
                            onClick={handleCsvSubmission}
                        >
                            Upload
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
                    <Grid item xs={12} sm={12} md={12}>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ m: 1, position: 'relative' }}>
                                <Button color="primary" variant="contained"
                                    onClick={getMerkleRoot}
                                    disabled={merklerootLoading}
                                >
                                    get merkleroot
                                    {
                                        merklerootLoading &&
                                        <SwitchProgress />
                                    }
                                </Button>
                            </Box>
                        </Box>

                    </Grid>
                    {
                        merkleroot &&
                        <Grid item xs={12} sm={12} md={12}>
                            <Stack sx={{ width: '100%' }} spacing={2}>
                                <Alert severity="success">{merkleroot}</Alert>
                            </Stack>
                        </Grid>
                    }

                </Grid>
            </Box>

            {
                loading ?
                    <Loader />
                    :
                    <>
                        {mintlist && mintlist.length > 0 ?
                            <>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left">No</StyledTableCell>
                                                <StyledTableCell align="left">Address</StyledTableCell>
                                                <StyledTableCell align="left">Number</StyledTableCell>
                                                <StyledTableCell align="left">Datetime</StyledTableCell>
                                                <StyledTableCell align="left">Remove</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {mintlist.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, key) => (
                                                    <StyledTableRow key={key}>
                                                        <StyledTableCell component="th" scope="row">
                                                            {(key + dynamicKey + 1)}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">{row.address}</StyledTableCell>
                                                        <StyledTableCell align="left">{row.number}</StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            {moment(row.createdAt).tz('America/Los_Angeles').format('MMMM Do YYYY, h:mm:ss a')}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            <IconButton aria-label="delete"
                                                                onClick={() => handleDeleteAddress(row._id)}
                                                            >
                                                                <DeleteIcon color="error" />
                                                            </IconButton>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={mintlist && mintlist?.length}
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
