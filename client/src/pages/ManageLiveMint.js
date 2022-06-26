import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import moment from "moment";
import 'moment-timezone';
import Paper from '@mui/material/Paper';
import api from "../utils/api";
import Loader from '../components/Loader/Loader';

import { setAlert } from "../actions/alert";
import { useDispatch } from 'react-redux';
import LiveMintABI from '../contracts/live-mint.json';
import { liveMintAddress } from '../contracts/addresses';


import {
    TIMEZONE,
    UPDATE_LIVE_MINT_ROUTE,
    UPDATE_GENESIS_LIVEMINT_ROUTE,
    UPDATE_PRESALE_ROUTE,
    UPDATE_SWITCH_ROUTE,
    UPDATE_TOTALSUPPLY_ROUTE,
    GET_ALL_ROUTE
}
    from '../utils/ManageLiveMintConstant'
import SwitchProgress from '../components/SwitchProgress';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase .Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));


const ManageLiveMint = ({ selectedAccount }) => {
    document.title = 'Admin Panel | Manage LiveMint';

    const [loading, setLoading] = useState(true);
    const [id, setId] = useState('');
    const [liveMintError, setLiveMintError] = useState([]);
    const [genesisLiveMintError, setGenesisLiveMintError] = useState([]);
    const [preSaleError, setPreSaleError] = useState([]);


    const [isMinting, setIsMinting] = useState(false);
    const [isPrivateSale, setIsPrivateSale] = useState(false);
    const [isPublicSale, setIsPublicSale] = useState(false);
    const [isPreSale, setIsPreSale] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [supplyCount, setSupplyCount] = useState(0);

    const [isDisplayLiveMintPage, setIsDisplayLiveMintPage] = useState(false);

    const [mintLoad, setMintLoad] = useState(false);
    const [privateSaleLoad, setPrivateSaleLoad] = useState(false);
    const [publicSaleLoad, setPublicSaleLoad] = useState(false);
    const [preSaleLoad, setPreSaleLoad] = useState(false);
    const [supplyLoad, setSupplyLoad] = useState(false);
    const [displayLiveMintPageLoad, setDisplayLiveMintPageLoad] = useState(false);

    const [owner, setOwner] = useState('');
    const [salePriceETH, setSalePriceETH] = useState(0);
    const [salePriceAPE, setSalePriceAPE] = useState(0);
    const [presaleMintedQty, setPresaleMintedQty] = useState(0);

    const [liveContract, setLiveContract] = useState(null);

    const dispatch = useDispatch()

    //Live mint timer :
    const [liveMintTimer, setLiveMintTimer] = useState(
        {
            liveMintStartTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm'),
            liveMintEndTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm')
        }
    );
    const { liveMintStartTime, liveMintEndTime } = liveMintTimer;


    //Genesis liveMint timer
    const [genesisLiveMintTimer, setGenesisLiveMintTimer] = useState(
        {
            genesisLiveMintStartTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm'),
            genesisLiveMintEndTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm')
        }
    );
    const { genesisLiveMintStartTime, genesisLiveMintEndTime } = genesisLiveMintTimer;

    //Pre sale timer
    const [preSaleTimer, setPreSaleTimer] = useState(
        {
            preSaleStartTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm'),
            preSaleEndTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm')
        }
    );
    const { preSaleStartTime, preSaleEndTime } = preSaleTimer;


    useEffect(async () => {
        getAllManageLiveMintDetails();

        //getStatusLiveMintFromContract();

    }, [selectedAccount])


    //Datetime change event
    const handleLiveMintChange = (e) => {
        setLiveMintTimer({ ...liveMintTimer, [e.target.name]: e.target.value });
        setAllErrorBlank();
    };

    const handleGenesisLiveMintChange = (e) => {
        setGenesisLiveMintTimer({ ...genesisLiveMintTimer, [e.target.name]: e.target.value });
        setAllErrorBlank();
    };

    const handlePreSaleChange = (e) => {
        setPreSaleTimer({ ...preSaleTimer, [e.target.name]: e.target.value });
        setAllErrorBlank();
    }

    const setAllErrorBlank = () => {
        setLiveMintError([]);
        setGenesisLiveMintError([]);
        setPreSaleError([]);
    }
    //

    //Handle sublit
    const handleLiveMintTimerSubmit = async () => {
        const { liveMintStartTime: start, liveMintEndTime: end } = liveMintTimer;

        if (validateTime(start, end, setLiveMintError)) {
            try {
                const body = { _id: id, liveMintStartTime, liveMintEndTime };
                const response = await api.put(UPDATE_LIVE_MINT_ROUTE, body);
                if (response.status === 200) {
                    dispatch(setAlert(response.data.message, "success"));
                }
            } catch (error) {
                console.log('handleLiveMintTimerSubmit=>', error.message);
                dispatch(setAlert('Something went wrong!', "error"));
            }
        }
    }

    const handleGenesisLiveMintTimerSubmit = async () => {
        const { genesisLiveMintStartTime: start, genesisLiveMintEndTime: end } = genesisLiveMintTimer;

        if (validateTime(start, end, setGenesisLiveMintError)) {
            try {
                const body = { _id: id, genesisLiveMintStartTime, genesisLiveMintEndTime };
                const response = await api.put(UPDATE_GENESIS_LIVEMINT_ROUTE, body);
                if (response.status === 200) {
                    dispatch(setAlert(response.data.message, "success"));
                }
            } catch (error) {
                console.log('handleGenesisLiveMintTimerSubmit=>', error.message);
                dispatch(setAlert('Something went wrong!', "error"));
            }
        }
    }

    //test-----
    const handlePreSaleTimerSubmit = async () => {
        const { preSaleStartTime: start, preSaleEndTime: end } = preSaleTimer;

        if (validateTime(start, end, setPreSaleError)) {
            try {
                const body = { _id: id, preSaleStartTime, preSaleEndTime };
                const response = await api.put(UPDATE_PRESALE_ROUTE, body);
                if (response.status === 200) {
                    dispatch(setAlert(response.data.message, "success"));
                }
            } catch (error) {
                console.log('handlePreSaleTimerSubmit=>', error.message);
                dispatch(setAlert('Something went wrong!', "error"));
            }
        }
    }
    //

    //Validate input time
    const validateTime = (start, end, setError) => {
        setError([]);
        let error = {};

        if (moment(start).toString() === moment(end).toString()) {
            error.start = "Start time shouldn't be same as end time";
            error.end = "End time shouldn't be same as start time";
        }
        else if (moment(end) < moment(start)) {
            error.end = 'End time should be greater than Start time';
        }
        if (Object.keys(error).length > 0) {
            setError(error)
            return false;
        }

        return true;
    }

    //Handle on/off
    const handleMinting = async () => {
        const updatedIsMinting = isMinting ? false : true;
        const body = { _id: id, operation: 'minting', isMinting: updatedIsMinting, wallet: selectedAccount.toString() };
        await handleSwitch(body, setIsMinting, isMinting, updatedIsMinting, setMintLoad);
    }

    const handlePublicSale = async () => {
        let account = selectedAccount.toString().toLowerCase();
        if (account != owner.toLowerCase()) {
            dispatch(setAlert('You can\'t change it.\nThe owner can change it.', "error"));
            return;
        }
        if (isMinting != true) {
            dispatch(setAlert('Minting is disable now.\n You can change it if Minting is active.', "error"));
            return;
        }
        if (isPreSale != false) {
            dispatch(setAlert('PreSale is active now.\n You can change it if preSale is false.', "error"));
            return;
        }
        const updatedIsPublicSale = isPublicSale ? false : true;

        const contract = new window.web3.eth.Contract(LiveMintABI, liveMintAddress);
        let res = await contract.methods.setPublicSaleActive(updatedIsPublicSale).send({
            from: selectedAccount
        });

        const body = { _id: id, operation: 'publicsale', isPublicSale: updatedIsPublicSale };
        await handleSwitch(body, setIsPublicSale, isPublicSale, updatedIsPublicSale, setPublicSaleLoad);
    }

    const handlePreSale = async () => {
        let account = selectedAccount.toString().toLowerCase();
        if (account != owner.toLowerCase()) {
            dispatch(setAlert('You can\'t change it.\nThe owner can change it.', "error"));
            return;
        }
        if (isMinting != true) {
            dispatch(setAlert('Minting is disable now.\n You can change it if Minting is active.', "error"));
            return;
        }
        const updatedIsPreSale = isPreSale ? false : true;

        const contract = new window.web3.eth.Contract(LiveMintABI, liveMintAddress);
        let res = await contract.methods.setPreSaleActive(updatedIsPreSale).send({
            from: selectedAccount
        });

        const body = { _id: id, operation: 'presale', isPreSale: updatedIsPreSale };
        await handleSwitch(body, setIsPreSale, isPreSale, updatedIsPreSale, setPreSaleLoad);
    }

    const handleDisplayLiveMintPage = async () => {
        const updatedIsDisplayLiveMintPage = isDisplayLiveMintPage ? false : true;

        const body = { _id: id, operation: 'livemintpage', isDisplayLiveMintPage: updatedIsDisplayLiveMintPage };
        await handleSwitch(body, setIsDisplayLiveMintPage, isDisplayLiveMintPage, updatedIsDisplayLiveMintPage, setDisplayLiveMintPageLoad);
    }

    const handleSwitch = async (body, setState, isExistingState, isStateValue, setLoad) => {
        setLoad(true);
        setState(isStateValue);
        try {
            const response = await api.put(UPDATE_SWITCH_ROUTE, body);
            if (response.status === 200) {
                dispatch(setAlert(response.data.message, "success"));
            }
        } catch (error) {
            setState(isExistingState);
            console.log('handleSwitch=>', error.message);
            dispatch(setAlert('Something went wrong!', "error"));
        } finally {
            setLoad(false);
        }
    }

    const handleTotalSupply = async () => {
        const body = { _id: id };
        setSupplyLoad(true);

        try {
            const response = await api.put(UPDATE_TOTALSUPPLY_ROUTE, body);
            if (response.status === 200) {
                setTotalCount(response.data.totalCount)
                setSupplyCount(response.data.supplyCount)
                dispatch(setAlert(response.data.message, "success"));
            }
        } catch (error) {
            console.log('handleTotalSupply=>', error.message);
            dispatch(setAlert('Something went wrong!', "error"));
        } finally {
            setSupplyLoad(false);
        }
    }
    //


    //To get manage liveMint page details
    const getAllManageLiveMintDetails = async () => {
        try {
            setLoading(true);

            const response = await api.get(GET_ALL_ROUTE);

            if (response.status === 200) {
                const result = response.data.result[0];
                console.log('===result1===', result)

                //set states
                if (result) {
                    const currentPstTime = moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm');

                    setLiveMintTimer({
                        liveMintStartTime: result.liveMintStartTime ? result.liveMintStartTime : currentPstTime,
                        liveMintEndTime: result.liveMintEndTime ? result.liveMintEndTime : currentPstTime
                    });

                    setGenesisLiveMintTimer({
                        genesisLiveMintStartTime: result.genesisLiveMintStartTime ? result.genesisLiveMintStartTime : currentPstTime,
                        genesisLiveMintEndTime: result.genesisLiveMintEndTime ? result.genesisLiveMintEndTime : currentPstTime
                    });

                    setPreSaleTimer({
                        preSaleStartTime: result.preSaleStartTime ? result.preSaleStartTime : currentPstTime,
                        preSaleEndTime: result.preSaleEndTime ? result.preSaleEndTime : currentPstTime
                    });

                    setId(result._id);
                    setIsMinting(result.isMinting);
                    setIsPublicSale(result.isPublicSaleActive);
                    setIsPreSale(result.isPreSaleActive);
                    setTotalCount(result.totalCount);
                    setSupplyCount(result.supplyCount);
                    setSalePriceETH(result.salePriceETH);
                    setSalePriceAPE(result.salePriceAPE);
                    setPresaleMintedQty(result.presaleMintedQty);
                }
            }
        } catch (error) {
            console.log('getAllManageLiveMintDetails=>', error.message);
            dispatch(setAlert('Something went wrong!', "error"));
        } finally {
            setLoading(false);
        }
    }

    //To get detail info from livemint contract
    const getStatusLiveMintFromContract = async () => {
        try {
            setLoading(true);
            if (selectedAccount == null) {
                console.log('getStatusLiveMintFromContract=> account Null');
                return;
            }
            const response = await api.get(`/livemint/getStatusLiveMintFromContract`);

            if (response.status === 200) {
                const result = response.data.data;
                
                //set states
                if (result) {
                    setIsPreSale(result.isPreSale);
                    setIsPublicSale(result.isPublicSale);
                    setTotalCount(result.totalCount);
                    setSupplyCount(result.supplyCount);
                    setOwner(result.owner);
                }
                //
            }
        } catch (error) {
            console.log('getAllManageLiveMintDetails=>', error.message);
            dispatch(setAlert('Something went wrong!', "error"));
        } finally {
            setLoading(false);
        }
    }

    //To update DB detail info from livemint contract
    const updateDBLiveMintStatus = async () => {
        try {
            setSupplyLoad(true);

            if (selectedAccount == null) {
                console.log('updateDBLiveMintStatus=> account Null');
                return;
            }
            const response = await api.put(`/livemint/updateDBLiveMintStatus`);
            console.log('===updateDBLiveMintStatus===', response);
            if (response.status === 200) {
                const res = response.data;

                //set states
                if (res) {
                    dispatch(setAlert('The status of live mint updated successfully.', "success"));

                    setIsMinting(res.result.isMinting);
                    setIsPublicSale(res.result.isPublicSale);
                    setIsPreSale(res.result.isPreSale);
                    setTotalCount(res.result.totalCount);
                    setSupplyCount(res.result.supplyCount);
                    setSalePriceETH(res.result.salePriceETH);
                    setSalePriceAPE(res.result.salePriceAPE);
                    setPresaleMintedQty(res.result.presaleMintedQty);
                }
                //
            }
        } catch (error) {
            console.log('updateDBLiveMintStatus=>', error.message);
            dispatch(setAlert('Something went wrong!', "error"));
        } finally {
            setSupplyLoad(false);
        }
    }


    return (
        <Box sx={{ p: 4 }}>
            {loading
                ?
                <Loader />
                :
                <Paper elevation={2}>
                    <Grid container spacing={1} padding={2}>

                        {/* Live mint timer */}
                        <Grid item xs={12} sm={12} lg={3}>
                            <Typography variant="button" display="block" gutterBottom sx={{my: "1.5rem"}}>
                                <b>
                                    Live mint timer :
                                </b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5} lg={3}>
                            <TextField
                                required
                                type="datetime-local"
                                label="Start Date(PST Time)"
                                name="liveMintStartTime"
                                value={liveMintStartTime}
                                onChange={handleLiveMintChange}
                                error={liveMintError.start ? true : false}
                                helperText={liveMintError.start}
                                sx={{my: "0.5rem"}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={7} lg={3}>
                            <TextField
                                required
                                type="datetime-local"
                                label="End Date(PST Time)"
                                name="liveMintEndTime"
                                value={liveMintEndTime}
                                onChange={handleLiveMintChange}
                                error={liveMintError.end ? true : false}
                                helperText={liveMintError.end}
                                sx={{my: "0.5rem"}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3}>
                            <Button
                                onClick={handleLiveMintTimerSubmit}
                                variant="contained"
                                sx={{mt: "1rem"}}
                            >
                                UPDATE
                            </Button>
                        </Grid>

                        {/* Genesis liveMint timer */}
                        <Grid item xs={12} sm={12} lg={3}>
                            <Typography variant="button" display="block" gutterBottom sx={{my: "1.5rem"}}>
                                <b>
                                    Genesis liveMint timer :
                                </b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5} lg={3}>
                            <TextField
                                required
                                type="datetime-local"
                                label="Start Date(PST Time)"
                                name="genesisLiveMintStartTime"
                                value={genesisLiveMintStartTime}
                                onChange={handleGenesisLiveMintChange}
                                error={genesisLiveMintError.start ? true : false}
                                helperText={genesisLiveMintError.start}
                                sx={{my: "0.5rem"}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={7} lg={3}>
                            <TextField
                                required
                                type="datetime-local"
                                label="End Date(PST Time)"
                                name="genesisLiveMintEndTime"
                                value={genesisLiveMintEndTime}
                                onChange={handleGenesisLiveMintChange}
                                error={genesisLiveMintError.end ? true : false}
                                helperText={genesisLiveMintError.end}
                                sx={{my: "0.5rem"}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3}>
                            <Button
                                onClick={handleGenesisLiveMintTimerSubmit}
                                variant="contained"
                                sx={{my: "1rem"}}
                            >
                                UPDATE
                            </Button>
                        </Grid>

                        {/* Pre sale timer */}
                        <Grid item xs={12} sm={12} lg={3}>
                            <Typography variant="button" display="block" gutterBottom sx={{my: "1.5rem"}}>
                                <b>
                                    Pre sale timer :
                                </b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5} lg={3}>
                            <TextField
                                required
                                type="datetime-local"
                                label="Start Date(PST Time)"
                                name="preSaleStartTime"
                                value={preSaleStartTime}
                                onChange={handlePreSaleChange}
                                error={preSaleError.start ? true : false}
                                helperText={preSaleError.start}
                                sx={{my: "0.5rem"}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={7} lg={3}>
                            <TextField
                                required
                                type="datetime-local"
                                label="End Date(PST Time)"
                                name="preSaleEndTime"
                                value={preSaleEndTime}
                                onChange={handlePreSaleChange}
                                error={preSaleError.end ? true : false}
                                helperText={preSaleError.end}
                                sx={{my: "0.5rem"}}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={3}>
                            <Button
                                onClick={handlePreSaleTimerSubmit}
                                variant="contained"
                                sx={{my: "1rem"}}
                            >
                                UPDATE
                            </Button>
                        </Grid>

                    </Grid>

                    <hr />


                    <Grid container spacing={1} padding={2}>
                        {/* ON/OFF switches */}
                        <Grid container item xs={12} sm={12} lg={6}>
                            {/* Minting */}
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Typography variant="button" display="block" gutterBottom>
                                    <b>Minting :</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>Off</Typography>
                                        <Box sx={{ m: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            {
                                                mintLoad &&
                                                <SwitchProgress />
                                            }
                                            <AntSwitch
                                                onClick={handleMinting}
                                                checked={isMinting}
                                                inputProps={{ 'aria-label': 'ant design' }}
                                                disabled={mintLoad ? true : false}
                                            />
                                        </Box>
                                        <Typography>On</Typography>
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* Public Sale */}
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Typography variant="button" display="block" gutterBottom>
                                    <b>Public Sale :</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>Off</Typography>
                                        <Box sx={{ m: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            {
                                                publicSaleLoad &&
                                                <SwitchProgress />
                                            }
                                            <AntSwitch
                                                onClick={handlePublicSale}
                                                checked={isPublicSale}
                                                inputProps={{ 'aria-label': 'ant design' }}
                                                disabled={publicSaleLoad ? true : false}
                                                value=""
                                            />
                                        </Box>
                                        <Typography>On</Typography>
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* Pre Sale */}
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Typography variant="button" display="block" gutterBottom>
                                    <b>Pre Sale :</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>Off</Typography>
                                        <Box sx={{ m: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            {
                                                preSaleLoad &&
                                                <SwitchProgress />
                                            }
                                            <AntSwitch
                                                onClick={handlePreSale}
                                                checked={isPreSale}
                                                inputProps={{ 'aria-label': 'ant design' }}
                                                disabled={preSaleLoad ? true : false}
                                                value=""
                                            />
                                        </Box>
                                        <Typography>On</Typography>
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>
                        {/* status values */}
                        <Grid container item xs={12} sm={12} lg={6}>
                            {/* Total Supply */}
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Typography variant="button" display="block" gutterBottom>
                                    <b>Total Supply :</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <span >{supplyCount} / {totalCount}</span>
                                    </Stack>
                                    {/* <Button
                                        onClick={handleTotalSupply}
                                        variant="contained"
                                    >
                                        {
                                            supplyLoad &&
                                            <SwitchProgress />
                                        }
                                        UPDATE
                                    </Button> */}
                                </Box>
                            </Grid>

                            {/* Sale price */}
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Typography variant="button" display="block" gutterBottom>
                                    <b>Sale Price :</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <span>{salePriceETH} ETH / {salePriceAPE} APE</span>
                                    </Stack>
                                </Box>
                            </Grid>

                            {/* presaleMintedQty */}
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Typography variant="button" display="block" gutterBottom>
                                    <b>Presale Minted Qty :</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <span>{presaleMintedQty}</span>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} lg={12} sx={{ padding: '0.5rem' }}>
                                <Button
                                    onClick={updateDBLiveMintStatus}
                                    variant="contained"
                                >
                                    {
                                        supplyLoad &&
                                        <SwitchProgress />
                                    }
                                    UPDATE
                                </Button>
                            </Grid>
                        </Grid>

                    </Grid>

                    <hr />
                    <Grid container spacing={1} padding={2}>
                        <Grid container item xs={12} sm={12} lg={6}>
                            {/* Display live-mint page */}
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Typography variant="button" display="block" gutterBottom>
                                    <b>Display live-mint page :</b>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} sx={{ padding: '0.5rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>Off</Typography>
                                        <Box sx={{ m: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            {
                                                displayLiveMintPageLoad &&
                                                <SwitchProgress />
                                            }
                                            <AntSwitch
                                                onClick={handleDisplayLiveMintPage}
                                                checked={isDisplayLiveMintPage}
                                                inputProps={{ 'aria-label': 'ant design' }}
                                                disabled={displayLiveMintPageLoad ? true : false}
                                                value=""
                                            />
                                        </Box>
                                        <Typography>On</Typography>
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            }
        </Box>
    )
}

const mapStatetoProps = (state) => ({
    selectedAccount: state.auth.account,
});

export default connect(mapStatetoProps)(ManageLiveMint);
