import React, { useState, useEffect } from "react";
import moment from "moment";
import 'moment-timezone';
import { connect } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import NumberFormat from 'react-number-format';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NoResults from '../../components/NoResults'


import { addAuction, updateAuction, deleteAuction, loadAuction, updateMintVisibility } from "../../actions/auction";
import Loader from "../Loader/Loader";


const timezoneName = 'America/Los_Angeles';


//Customize table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#0a4350',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

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


const Dashboard = ({ rows, isLoading, addAuction, loadAuction, updateAuction, updateMintVisibility, deleteAuction }) => {
  document.title = 'Admin Panel | 1of1s';

  const [auctionOperation, setAuctionOperation] = useState('CREATE');
  // For Modal
  const [open, setOpen] = useState(false);
  const [error, setError] = useState([]);


  const initialFormData = {
    title: "",
    desc: "",
    start: moment().tz(timezoneName).format('YYYY-MM-DDTHH:mm'),
    end: moment().tz(timezoneName).format('YYYY-MM-DDTHH:mm'),
    price: 0,
    metadata: "",
    mintText: "",
    _id: ''
  }

  //form data
  const [formData, setFormData] = useState(initialFormData);

  const { title, desc, start, end, price, metadata, mintText, _id } = formData;

  //Handle modal open event
  const handleClickOpen = (auctionData) => {
    if (auctionData !== null) {
      setFormData({
        title: auctionData.title,
        desc: auctionData.desc,
        start: moment(auctionData.start).tz(timezoneName).format('YYYY-MM-DDTHH:mm'),
        end: moment(auctionData.end).tz(timezoneName).format('YYYY-MM-DDTHH:mm'),
        price: auctionData.price,
        metadata: auctionData.metadata,
        mintText: auctionData.mintText,
        _id: auctionData._id
      })
      setAuctionOperation('UPDATE')
    } else {
      setFormData(initialFormData);
      setAuctionOperation('CREATE')
    }
    setOpen(true);
  };


  //Handle form submission
  const handleSubmit = () => {
    if (Validate()) {
      if (auctionOperation === 'CREATE') {
        addAuction(
          title,
          desc,
          start + moment().tz(timezoneName).format(':ss.SSSSZ'),
          end + moment().tz(timezoneName).format(':ss.SSSSZ'),
          price,
          metadata,
          mintText
        );
      } else {
        updateAuction(title,
          desc,
          start + moment().tz(timezoneName).format(':ss.SSSSZ'),
          end + moment().tz(timezoneName).format(':ss.SSSSZ'),
          price,
          metadata,
          mintText,
          _id
        );
      }
      setOpen(false);
      setError([]);
    }
  };

  //Validate fields 
  const Validate = () => {
    let error = {};
    if (!title) {
      error.title = 'Title is required';
    }
    if (!desc) {
      error.desc = 'Desc is required';
    }
    if (!price) {
      error.price = 'Price is required';
    }
    if (!metadata) {
      error.metadata = 'Metadata is required';
    }
    if (!mintText) {
      error.mintText = "Mint text is required"
    }

    //Only validate time on new auction creation time
    if (auctionOperation === 'CREATE') {
      const currentPstTime = moment(moment().tz(timezoneName).format('YYYY-MM-DDTHH:mm'));
      if (moment(start) < currentPstTime) {
        error.start = 'Start time should be greater than current time';
      }
      else if (moment(start).toString() === moment(end).toString()) {
        error.start = "Start time shouldn't be same as end time";
        error.end = "End time shouldn't be same as start time";
      }
      else if (moment(end) < moment(start)) {
        error.end = 'End time should be greater than Start time';
      }
    }

    if (Object.keys(error).length > 0) {
      setError(error)
      return false;
    }

    return true;
  }

  //Handle auction delete 
  const handleDelete = (_id) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      deleteAuction(_id);
    }
  };

  //Handle modal close
  const handleClose = () => {
    setOpen(false);
    setError([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Handle mint visibility on/off event
  const handleMintVisibility = (data) => {
    updateMintVisibility(data)
  }

  // For Table
  const columns = [
    { id: "srNo", label: "No", align: "left" },
    { id: "title", label: "Title", align: "left" },
    { id: "desc", label: "Description", align: "left" },
    { id: "start", label: "Start Date(PST Time)", align: "center" },
    { id: "end", label: "End Date(PST Time)", align: "center" },
    { id: "price", label: "Price", align: "right" },
    { id: "metadata", label: "MetaData URL", align: "left" },
    { id: "mintbuttontext", label: "Mint Button Text", align: "left" },
    { id: "mintvisibility", label: "Mint Visibility", align: "left" },
    { id: "action", label: "Action", align: "center" },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //

  useEffect(() => {
    loadAuction();
  }, [loadAuction]);

  return (
    <>
      <Box sx={{ '& button': { m: 1 } }}>
        <Button variant="contained" onClick={() => handleClickOpen(null)} color="secondary">
          Add Auction
        </Button>
      </Box>

      {/* Add auction dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Auction</DialogTitle>
        <DialogContent>
          <DialogContentText>Fill the auction details</DialogContentText>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "60ch" },
            }}
            autoComplete="off"
          >
            <TextField
              required
              label="Title"
              name="title"
              value={title}
              error={error.title ? true : false}
              onChange={handleChange}
            />

            <br />
            <TextField
              required
              label="Description"
              name="desc"
              value={desc}
              error={error.desc ? true : false}
              onChange={handleChange}
            />
            <br />
            <TextField
              required
              type="datetime-local"
              label="Start Date(PST Time)"
              name="start"
              value={start}
              onChange={handleChange}
              error={error.start ? true : false}
              helperText={error.start && error.start}
            />
            <br />
            <TextField
              required
              type="datetime-local"
              label="End Date(PST Time)"
              name="end"
              value={end}
              onChange={handleChange}
              error={error.end ? true : false}
              helperText={error.end && error.end}
            />
            <br />
            <NumberFormat
              required
              label="Price(ETH)"
              name="price"
              value={price === 0 ? '' : price}
              error={error.price ? true : false}
              onChange={handleChange}
              customInput={TextField}
              allowNegative={false}
              decimalScale={2}
            />
            <br />
            <TextField
              required
              type="url"
              label="Link to NFT Metadata"
              name="metadata"
              value={metadata}
              error={error.metadata ? true : false}
              onChange={handleChange}
            />
            <br />
            <TextField
              required
              label="Mint text"
              name="mintText"
              value={mintText}
              error={error.mintText ? true : false}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={{ '& button': { m: 1 } }}>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {auctionOperation}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {isLoading ?
        <Loader />
        :
        <>
          {rows.length > 0 ?
            <Paper
              sx={{
                padding: "20px",
                overflow: "hidden",
              }}
            >
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">

                  {/* Table column titles */}
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <StyledTableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </StyledTableCell>

                      ))}
                    </TableRow>
                  </TableHead>

                  {/* Table content */}
                  <TableBody>
                    {rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((auction, key) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={key}
                          >
                            <TableCell align='left'>
                              {key + 1}
                            </TableCell>
                            <TableCell align='left'>
                              {auction.title}
                            </TableCell>
                            <TableCell align='left'>
                              {auction.desc}
                            </TableCell>
                            <TableCell align='center'>
                              {moment(auction.start).tz(timezoneName).format('MMMM Do YYYY, h:mm:ss a')}
                            </TableCell>
                            <TableCell align='center'>
                              {moment(auction.end).tz(timezoneName).format('MMMM Do YYYY, h:mm:ss a')}
                            </TableCell>
                            <TableCell align='right'>
                              {auction.price}
                            </TableCell>
                            <TableCell align='left'>
                              {auction.metadata}
                            </TableCell>
                            <TableCell align='left'>
                              {auction.mintText}
                            </TableCell>
                            <TableCell align='left'>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography>Off</Typography>
                                <AntSwitch defaultChecked={auction.isMintVisible}
                                  onClick={() => handleMintVisibility({ _id: auction._id, isMintVisible: auction.isMintVisible })}
                                  inputProps={{ 'aria-label': 'ant design' }}
                                />
                                <Typography>On</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align='center'>
                              <Box sx={{ '& button': { m: 1 } }}>
                                <Button variant="outlined" size="small" onClick={() => handleClickOpen(auction)}>
                                  Edit
                                </Button>
                                <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(auction._id)}>
                                  Delete
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>

                </Table>
              </TableContainer>
              {/* For Pagination */}
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
            :
            <NoResults />
          }
        </>
      }
    </>
  );
};
const mapStateToProps = (state) => ({
  rows: state.auction.auctions,
  isLoading: state.auction.loading,
});

export default connect(mapStateToProps, { addAuction, updateAuction, deleteAuction, loadAuction, updateMintVisibility })(Dashboard);
