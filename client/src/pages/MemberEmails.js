import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { CSVLink } from "react-csv";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import moment from "moment";
import 'moment-timezone';
import api from "../utils/api";
import { setAlert } from "../actions/alert";
import Loader from "../components/Loader/Loader";
import EmailTable from "../components/memberemails/EmailTable";
import NoResults from "../components/NoResults";

const MemberEmails = () => {
    document.title = 'Admin Panel | Member Email'

    const [loading, setLoading] = useState(true);
    const [emailList, setEmailList] = useState([]);
    const [csvEmailList, setCsvEmailList] = useState([]);

    const [csvFileName, setCsvFileName] = useState('');

    const dispatch = useDispatch();

    function deleteId(arr) {
        return arr.map(({ _id, createdAt, ...rest }) => rest)
    }

    //To get all email list 
    const getAllEmails = async () => {
        try {
            setLoading(true);
            const response = await api.get("/memberemail/getAll");
            if (response.status === 200) {
                setEmailList(response.data.result);
                setCsvEmailList(deleteId(response.data.result));
            }
        } catch (error) {
            dispatch(setAlert(error.message, "error"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllEmails();
    }, [])


    return (
        <>
            {
                loading
                    ?
                    <Loader />
                    :
                    <>
                        {emailList && emailList.length > 0 ?
                            <>
                                <Box sx={{ flexGrow: 1, padding: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={2} sm={2} md={2}>
                                            <CSVLink data={csvEmailList}
                                                filename={csvFileName}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Button color="secondary" variant="contained" component="span"
                                                    onClick={() => setCsvFileName(`member-email-${moment().format('YYYYMMDDHHmmss')}`)}
                                                >
                                                    Export CSV
                                                </Button>
                                            </CSVLink>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <EmailTable emailList={emailList} />
                            </>
                            :
                            <NoResults />
                        }
                    </>

            }
        </>
    )
}

export default MemberEmails
