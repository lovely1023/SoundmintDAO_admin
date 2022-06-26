import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, CardHeader } from "@mui/material";
import { logout } from "../../actions/auth";


import { setAlert } from "../../actions/alert";
import { useDispatch } from 'react-redux';


let pages = [];
const Header = ({ selectedAccount, token, logout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [activeMenu, setActiveMenu] = useState('/')

  const { pathname } = location;

  useEffect(() => {
    setActiveMenu(pathname)
  }, [pathname])

  let settings = [];
  if (token) {
    settings = [selectedAccount ? selectedAccount : "Not connected", "Log Out"];
    pages = [
      // { title: 'Auction', link: '/' },
      { title: 'LiveMint', link: '/' },
      // { title: 'LiveMint', link: '/livemint' },
      { title: 'Stem', link: '/stem' },
      { title: '1of1s', link: '/1of1s' },
      { title: 'Timer', link: '/timer' },
      { title: 'Mintlist', link: '/mintlist' },
      { title: 'Member Email', link: '/member-emails' }
    ];
  } else {
    settings = [selectedAccount ? selectedAccount : "Not connected"];
    pages = []
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (value) => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (value) => {
    if (value === 'Log Out') {
      setActiveMenu("/");
      logout(navigate)
    } else if (value.length !== undefined && value !== 'Not connected') {
      navigator.clipboard.writeText(value);

      dispatch(setAlert('Wallet id copied to clipboard', "info"));
    }
    setAnchorElUser(null);
  };

  const onAdminPanelClick = () => {
    navigate("/");
  }

  return (
    <AppBar position="static" sx={{ bgcolor: "#3EB489" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            onClick={() => onAdminPanelClick()}
          >
            Admin Panel
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {/* Mobile view */}
              {pages.map((page, key) => (
                <NavLink to={page.link}
                  key={key}
                  style={{ textDecoration: 'none', color: 'black' }}>
                  <MenuItem key={key}>
                    {page.title}
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            onClick={() => navigate("/")}
          >
            <span style={{cursor: "pointer", userSelect: "none"}}>Admin Panel</span>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {/* Desktop view */}
            {pages.map((page, key) => (
              <NavLink
                to={page.link}
                key={key}
                style={{ textDecoration: 'none', color: 'white' }}>
                <Button
                  sx={{ my: 2, color: activeMenu === page.link ? 'black' : 'white', fontFamily: 'system-ui', display: 'block' }}
                >
                  {page.title}
                </Button>
              </NavLink>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="View Wallet Id">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <CardHeader
                  avatar={
                    <Avatar
                      alt={selectedAccount && selectedAccount}
                    />
                  }
                  title={selectedAccount && `${selectedAccount.substr(0, 4)}...${selectedAccount.slice(-4)}`}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => {
                let disp = setting;
                if (setting.length > 16) {
                  disp = `${setting.substr(0, 4)}...${setting.slice(-4)}`
                }
                return (
                  <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                    <Typography textAlign="center">{disp}</Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  );
};

const mapStatetoProps = (state) => ({
  selectedAccount: state.auth.account,
  token: state.auth.token
});

export default connect(mapStatetoProps, { logout })(Header);

