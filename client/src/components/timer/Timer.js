import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import PstTimer from './PstTimer';
import api from '../../utils/api';
import { setAlert } from "../../actions/alert";
import Loader from '../Loader/Loader';
import NoResults from '../NoResults';


// const Timer = () => {
const Timer = ({ selectedAccount }) => {
    document.title = 'Admin Panel | Timer'
    console.log('=====timer account=====', selectedAccount);
    
    const [auctions, setAuctions] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const getTime = async () => {
        try {
            const response = await api.get("/auctions/all");
            if (response.status === 200) {
                setAuctions(response);
            }
        } catch (err) {
            dispatch(setAlert(err.message, "error"));
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getTime();
    }, [])


    return (
        <>
            {isLoading ? <Loader /> :
                <>
                    {auctions?.data?.length > 0
                        ?
                        <Grid container spacing={1}>
                            {auctions?.data?.map((auction, key) => {
                                return (
                                    <Grid item xs={12} sm={6} md={6} lg={4} xl={4} key={key}>
                                        <Box sx={{ padding: 2 }}>
                                            <Card>
                                                <CardContent>
                                                    {/* <PstTimer key={key} data={auction} /> */}
                                                    <PstTimer key={key} data={auction} selectedAccount={selectedAccount} />
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </Grid>
                                )
                            })}
                        </Grid>
                        :
                        <NoResults />
                    }
                </>
            }
        </>

    )
}

const mapStatetoProps = (state) => ({
    selectedAccount: state.auth.account,
});

export default connect(mapStatetoProps)(Timer);
// export default Timer