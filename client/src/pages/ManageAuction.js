import React, { useState, useEffect } from 'react'
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

import {
    TIMEZONE,
    UPDATE_LIVE_MINT_ROUTE,
    UPDATE_GENESIS_AUCTION_ROUTE,
    UPDATE_PRESALE_ROUTE,
    UPDATE_SWITCH_ROUTE,
    UPDATE_TOTALSUPPLY_ROUTE,
    GET_ALL_ROUTE
}
    from '../utils/ManageAuctionConstant'
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
        '& .MuiSwitch-switchBase.Mui-checked': {
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


const ManageAuction = () => {
    document.title = 'Admin Panel | Manage Auction';

    const [loading, setLoading] = useState(true);
    const [id, setId] = useState('');
    const [liveMintError, setLiveMintError] = useState([]);
    const [genesisAuctionError, setGenesisAuctionError] = useState([]);
    const [preSaleError, setPreSaleError] = useState([]);


    const [isMinting, setIsMinting] = useState(false);
    const [isPrivateSale, setIsPrivateSale] = useState(false);
    const [isPublicSale, setIsPublicSale] = useState(false);
    const [isPreSale, setIsPreSale] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0);

    const [mintLoad, setMintLoad] = useState(false);
    const [privateSaleLoad, setPrivateSaleLoad] = useState(false);
    const [publicSaleLoad, setPublicSaleLoad] = useState(false);
    const [preSaleLoad, setPreSaleLoad] = useState(false);

    const dispatch = useDispatch()


    //Live mint timer :
    const [liveMintTimer, setLiveMintTimer] = useState(
        {
            liveMintStartTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm'),
            liveMintEndTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm')
        }
    );
    const { liveMintStartTime, liveMintEndTime } = liveMintTimer;


    //Genesis auction timer
    const [genesisAuctionTimer, setGenesisAuctionTimer] = useState(
        {
            genesisAuctionStartTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm'),
            genesisAuctionEndTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm')
        }
    );
    const { genesisAuctionStartTime, genesisAuctionEndTime } = genesisAuctionTimer;

    //Pre sale timer
    const [preSaleTimer, setPreSaleTimer] = useState(
        {
            preSaleStartTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm'),
            preSaleEndTime: moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm')
        }
    );
    const { preSaleStartTime, preSaleEndTime } = preSaleTimer;


    //Datetime change event
    const handleLiveMintChange = (e) => {
        setLiveMintTimer({ ...liveMintTimer, [e.target.name]: e.target.value });
        setAllErrorBlank();
    };

    const handleGenesisAuctionChange = (e) => {
        setGenesisAuctionTimer({ ...genesisAuctionTimer, [e.target.name]: e.target.value });
        setAllErrorBlank();
    };

    const handlePreSaleChange = (e) => {
        setPreSaleTimer({ ...preSaleTimer, [e.target.name]: e.target.value });
        setAllErrorBlank();
    }

    const setAllErrorBlank = () => {
        setLiveMintError([]);
        setGenesisAuctionError([]);
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

    const handleGenesisAuctionTimerSubmit = async () => {
        const { genesisAuctionStartTime: start, genesisAuctionEndTime: end } = genesisAuctionTimer;

        if (validateTime(start, end, setGenesisAuctionError)) {
            try {
                const body = { _id: id, genesisAuctionStartTime, genesisAuctionEndTime };
                const response = await api.put(UPDATE_GENESIS_AUCTION_ROUTE, body);
                if (response.status === 200) {
                    dispatch(setAlert(response.data.message, "success"));
                }
            } catch (error) {
                console.log('handleGenesisAuctionTimerSubmit=>', error.message);
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
        const body = { _id: id, operation: 'minting', isMinting: updatedIsMinting };

        await handleSwitch(body, setIsMinting, isMinting, updatedIsMinting, setMintLoad);
    }

    const handlePublicSale = async () => {
        const updatedIsPublicSale = isPublicSale ? false : true;
        const body = { _id: id, operation: 'publicsale', isPublicSale: updatedIsPublicSale };
        await handleSwitch(body, setIsPublicSale, isPublicSale, updatedIsPublicSale, setPublicSaleLoad);
    }

    const handlePreSale = async () => {
        const updatedIsPreSale = isPreSale ? false : true;
        const body = { _id: id, operation: 'presale', isPreSale: updatedIsPreSale };
        await handleSwitch(body, setIsPreSale, isPreSale, updatedIsPreSale, setPreSaleLoad);
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
        const _totalSupply = 20;
        const body = { _id: id, totalSupply: _totalSupply };

        try {
            const response = await api.put(UPDATE_TOTALSUPPLY_ROUTE, body);
            if (response.status === 200) {
                setTotalSupply(_totalSupply)
                dispatch(setAlert(response.data.message, "success"));
            }
        } catch (error) {
            console.log('handleTotalSupply=>', error.message);
            dispatch(setAlert('Something went wrong!', "error"));
        } finally {
        }
    }
    //


    //To get manage auction page details
    const getAllManageAuctionDetails = async () => {
        try {
            setLoading(true);

            const response = await api.get(GET_ALL_ROUTE);

            if (response.status === 200) {
                const result = response.data.result[0];

                //set states
                if (result) {
                    const currentPstTime = moment().tz(TIMEZONE).format('YYYY-MM-DDTHH:mm');

                    setLiveMintTimer({
                        liveMintStartTime: result.liveMintStartTime ? result.liveMintStartTime : currentPstTime,
                        liveMintEndTime: result.liveMintEndTime ? result.liveMintEndTime : currentPstTime
                    });

                    setGenesisAuctionTimer({
                        genesisAuctionStartTime: result.genesisAuctionStartTime ? result.genesisAuctionStartTime : currentPstTime,
                        genesisAuctionEndTime: result.genesisAuctionEndTime ? result.genesisAuctionEndTime : currentPstTime
                    });

                    setPreSaleTimer({
                        preSaleStartTime: result.preSaleStartTime ? result.preSaleStartTime : currentPstTime,
                        preSaleEndTime: result.preSaleEndTime ? result.preSaleEndTime : currentPstTime
                    });

                    setId(result._id);
                    setIsMinting(result.isMinting);
                    setIsPrivateSale(result.isPrivateSale);
                    setIsPublicSale(result.isPublicSale);
                    setIsPreSale(result.isPreSale);
                    setTotalSupply(result.totalSupply);
                }
                //
            }
        } catch (error) {
            console.log('getAllManageAuctionDetails=>', error.message);
            dispatch(setAlert('Something went wrong!', "error"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllManageAuctionDetails();
    }, [])

    return (
        <Box sx={{ p: 4 }}>
            {loading
                ?
                <Loader />
                :
                <Paper elevation={2}>
                    <Grid container spacing={3} padding={2}>

                        {/* Live mint timer */}
                        <Grid item xs={12} sm={12} lg={2}>
                            <Typography variant="button" display="block" gutterBottom>
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
                                helperText={liveMintError.start && liveMintError.start}
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
                                helperText={liveMintError.end && liveMintError.end}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                            <Button
                                onClick={handleLiveMintTimerSubmit}
                                variant="contained"
                            >
                                UPDATE
                            </Button>
                        </Grid>

                        {/* Genesis auction timer */}
                        <Grid item xs={12} sm={12} lg={2}>
                            <Typography variant="button" display="block" gutterBottom>
                                <b>
                                    Genesis auction timer :
                                </b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={5} lg={3}>
                            <TextField
                                required
                                type="datetime-local"
                                label="Start Date(PST Time)"
                                name="genesisAuctionStartTime"
                                value={genesisAuctionStartTime}
                                onChange={handleGenesisAuctionChange}
                                error={genesisAuctionError.start ? true : false}
                                helperText={genesisAuctionError.start && genesisAuctionError.start}
                            />
                        </Grid>
                        <Grid item xs={12} sm={7} lg={3}>
                            <TextField
                                required
                                type="datetime-local"
                                label="End Date(PST Time)"
                                name="genesisAuctionEndTime"
                                value={genesisAuctionEndTime}
                                onChange={handleGenesisAuctionChange}
                                error={genesisAuctionError.end ? true : false}
                                helperText={genesisAuctionError.end && genesisAuctionError.end}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                            <Button
                                onClick={handleGenesisAuctionTimerSubmit}
                                variant="contained"
                            >
                                UPDATE
                            </Button>
                        </Grid>

                        {/* Pre sale timer */}
                        <Grid item xs={12} sm={12} lg={2}>
                            <Typography variant="button" display="block" gutterBottom>
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
                                helperText={preSaleError.start && preSaleError.start}
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
                                helperText={preSaleError.end && preSaleError.end}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                            <Button
                                onClick={handlePreSaleTimerSubmit}
                                variant="contained"
                            >
                                UPDATE
                            </Button>
                        </Grid>

                    </Grid>

                    <hr />

                    {/* ON/OFF switches */}
                    <Grid container spacing={2} padding={4}>

                        {/* Minting */}
                        <Grid item xs={6} sm={3} lg={2}>
                            <Typography variant="button" display="block" gutterBottom>
                                <b>Minting :</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={9} lg={10}>
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
                        <Grid item xs={6} sm={3} lg={2}>
                            <Typography variant="button" display="block" gutterBottom>
                                <b>Public Sale :</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={9} lg={10}>
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
                                        />
                                    </Box>
                                    <Typography>On</Typography>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* Pre Sale */}
                        <Grid item xs={6} sm={3} lg={2}>
                            <Typography variant="button" display="block" gutterBottom>
                                <b>Pre Sale :</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={9} lg={10}>
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
                                        />
                                    </Box>
                                    <Typography>On</Typography>
                                </Stack>
                            </Box>
                        </Grid>

                        {/* Total Supply */}
 {/*                        <Grid item xs={6} sm={3} lg={2}>
                            <Typography variant="button" display="block" gutterBottom>
                                <b>Total Supply :</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={9} lg={10}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <div style={{marginRight: '120px'}}>{ totalSupply }</div>
                                </Stack>
                                <Button
                                    onClick={handleTotalSupply}
                                    variant="contained"
                                >
                                    UPDATE
                                </Button>
                            </Box>
                        </Grid> */}

                    </Grid>
                </Paper>
            }
        </Box>
    )
}

export default ManageAuction