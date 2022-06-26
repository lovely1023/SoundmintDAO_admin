import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import moment from "moment";


const UtcTimer = (props) => {
    const { start: startTime, end: endTime, title } = props.data;

    let timeBetween = 0;

    const currentUtcTime = moment(moment().utc().toISOString());
    const [currentTime, setCurrentTime] = useState(currentUtcTime);

    const [auctionMessage, setAuctionMessage] = useState('--h --min --s');
    const [isAuction, setIsAuction] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isAuction) {
                setCurrentTime(moment(moment().utc().toISOString()));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isAuction]);


    const startTimeDiff = currentTime.diff(moment.utc(startTime).format());
    const endTimeDiff = moment(moment.utc(endTime).format()).diff(currentTime);


    //Check start time is greater than current time and less than current time
    if (startTimeDiff > 0 && endTimeDiff > 0) {     //Display timer
        const utcEndTime = moment(moment.utc(endTime).format());
        timeBetween = moment.duration(utcEndTime.diff(currentTime));
    } else if (startTimeDiff > 0) {     //Auction end
        timeBetween = 0;
        if (!auctionMessage.includes('end')) {
            setAuctionMessage(`Auction end at : ${moment.utc(endTime).local().format('MMMM Do YYYY, h:mm:ss a')}`);
            setIsAuction(false);
        }
        // console.log('Auction end');
    } else if (startTimeDiff < 0) {     //Remaining to start
        // if (auctionMessage !== 'Remaining to start') {
        //     setAuctionMessage('Remaining to start');
        // }

        if (!auctionMessage.includes('start')) {
            setAuctionMessage(`Auction will start at : ${moment.utc(startTime).local().format('MMMM Do YYYY, h:mm:ss a')}`);
        }
        // console.log('Remaining to start');
    }

    return (
        <>
            {
                timeBetween
                    ?
                    <>
                        <Typography variant="h5" gutterBottom component="div">
                            {title}
                        </Typography>
                        <Typography variant="h6" gutterBottom component="div">
                            {timeBetween.months() > 0 ? <span>{timeBetween.months()}m </span> : ''}
                            {timeBetween.days() > 0 ? <span>{timeBetween.days()}d </span> : ''}
                            <span>{timeBetween.hours()}h </span>
                            <span>{timeBetween.minutes()}min </span>
                            <span>{timeBetween.seconds()}s </span>
                        </Typography>
                    </>
                    :
                    <>
                        <Typography variant="h5" gutterBottom component="div">
                            {title}
                        </Typography>
                        <Typography variant="h6" gutterBottom component="div">
                            {auctionMessage}
                        </Typography>
                    </>

            }
        </>
    );
}

export default UtcTimer