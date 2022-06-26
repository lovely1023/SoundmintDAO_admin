import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import moment from "moment";
import 'moment-timezone';
import Grid from '@mui/material/Grid';
import { Button } from "@mui/material";
import Web3 from 'web3';

import LiveMintABI from '../../contracts/live-mint.json';
import { liveMintAddress } from '../../contracts/addresses';
import { nounAuctionAddress } from '../../contracts/addresses';
import { setAlert } from "../../actions/alert";
import { useDispatch } from 'react-redux';

import api from "../../utils/api";

const PstTimer = (props) => {
    const { start: startTime, end: endTime, title, isMintVisible, mintText, account } = props.data;
    const isMintDisable = isMintVisible ? false : true;

    const selectedAccount = props.selectedAccount;
    let timeBetween = 0;

    const currentPstTime = moment(moment().tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss.SSSSZ'));
    const [currentTime, setCurrentTime] = useState(currentPstTime);

    const [isAuction, setIsAuction] = useState(true);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch()

    useEffect(() => {
        const interval = setInterval(() => {
            if (isAuction) {
                setCurrentTime(moment(moment().tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss.SSSSZ')));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isAuction]);

    const startTimeDiff = currentTime.diff(moment(startTime));
    const endTimeDiff = moment(endTime).diff(currentTime);


    //Check start time is greater than current time and less than current time
    if (startTimeDiff > 0 && endTimeDiff > 0) {     //Display timer
        const pstEndTime = moment(moment(endTime).format());
        timeBetween = moment.duration(pstEndTime.diff(currentTime));
    } else if (startTimeDiff > 0) {     //Auction end
        timeBetween = 0;
        if (isAuction) {
            setIsAuction(false);
        }
    }

     //Handle auction mint
     const handleAunctionMinting = async () => {
        let selAccount = selectedAccount.toString().toLowerCase();
        
        console.log('===account selAccount===', selectedAccount);
        // if(account != selectedAccount.toLowerCase() ){
        //     dispatch(setAlert('You can\'t change it.\nThe auction isn\'t for you.', "error"));
        //     return;
        // }
        const contract = new window.web3.eth.Contract(LiveMintABI, liveMintAddress);
        let balance = await contract.methods.balanceOf(selAccount).call();
        console.log(balance);

        // try {
        //     setLoading(true);
        //     const response = await api.get(`/mintlist/getNftIdListByAccount/${selectedAccount}`);
        //     if (response.status === 200) {
        //         console.log(response.data);
        //     }
        // } catch (error) {
        //     dispatch(setAlert(error.message, "error"));
        // } finally {
        //     setLoading(false);
        // } 
    }

    return (
        <>
            <Typography variant="h5" gutterBottom component="div">
                {title}
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
                <b>Account No : </b>{account}
            </Typography>
            {
                timeBetween
                    ?
                    <>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Typography variant="body2" gutterBottom>
                                    Auction ends in
                                </Typography>
                                <Typography variant="h6" gutterBottom component="div">
                                    {timeBetween.months() > 0 ? <span>{timeBetween.months()}m </span> : ''}
                                    {timeBetween.days() > 0 ? <span>{timeBetween.days()}d </span> : ''}
                                    <span>{timeBetween.hours()}h </span>
                                    <span>{timeBetween.minutes()}min </span>
                                    <span>{timeBetween.seconds()}s </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Typography variant="body2" gutterBottom>
                                    End on {moment(endTime).format('MMMM Do YYYY')}
                                </Typography>
                                <Typography variant="h6" gutterBottom component="div">
                                    {moment(endTime).format('h:mm:ss a')}
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                    :
                    <>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                <Typography variant="body2" gutterBottom>
                                    {startTimeDiff > 0
                                        ?
                                        `Ended on ${moment(endTime).format('MMMM Do YYYY')}`
                                        :
                                        `Start on ${moment(startTime).format('MMMM Do YYYY')}`
                                    }
                                </Typography>
                                <Typography variant="h6" gutterBottom component="div">
                                    {startTimeDiff > 0
                                        ?
                                        moment(endTime).format('h:mm:ss a')
                                        :
                                        moment(startTime).format('h:mm:ss a')
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
            }
            <Button variant="contained" disabled={isMintDisable}  onClick={handleAunctionMinting}>
                {mintText}
            </Button>
        </>
    );
}

export default PstTimer