import { useState, useRef, useEffect, useContext, memo } from 'react';
import Kategoriak from './Kategoriak';
import Kosar from './Kosar';
import { KosarContext } from '../Providers/KosarContext';
import { UserContext } from '../Providers/UserContext';
import Search from './Search';
import { PageLinks, PageLink } from "../Fiok/PageLinks";
import { Link, useLocation } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Drawer from '@material-ui/core/Drawer';
import Slide from '@material-ui/core/Slide';
import Container from '@material-ui/core/Container';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { Flipped } from "react-flip-toolkit";
import { IconChevronDown, IconChevronRight, IconUser, IconLogout, IconShoppingCart, IconX } from 'tabler-icons';

export default function Header ({ isMobile, openLoginModal, showSnack, hideSnack }) {
  const location = useLocation();
  const [kategoriakOpen, setKategoriakOpen] = useState(false);
  const [keresesOpen, setKeresesOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const { kosarOpen, openKosar, closeKosar, kosar } = useContext(KosarContext);
  const { user } = useContext(UserContext);
  const kategoriakDrawerRef = useRef(null);
  const kosarDrawerRef = useRef(null);
  const [hideTarget, setHideTarget] = useState(window);
  const [differentElevationTarget, setDifferentElevationTarget] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/termek")) {
      setHideTarget(document.getElementsByClassName("termekPage")[0]);
    } else {
      setHideTarget(document.getElementsByClassName("appWrapper")[0])
    }
  }, [location])

  useEffect(() => {
    if (kategoriakOpen) {
      setDifferentElevationTarget(kategoriakDrawerRef.current);
    } else if (kosarOpen) {
      setDifferentElevationTarget(kosarDrawerRef.current);
    } else {
      setDifferentElevationTarget(false);
    }
  }, [kategoriakOpen, kosarOpen])

  const hidden = (useScrollTrigger({
    threshold: 0,
    target: hideTarget,
  }) && !keresesOpen) || (location.pathname === "/checkout");
  
  const elevated = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,    
    target: differentElevationTarget ? differentElevationTarget : hideTarget,
  });

  const handleKategoriakOpen = () => {
    closeKosar();
    handleAccountDropdownClose();
    setKategoriakOpen(true);
  };

  const handleKategoriakClose = () => {
    setKategoriakOpen(false);
  };
  
  const handleKeresesOpen = () => {
    closeKosar();
    handleKategoriakClose();
    setKeresesOpen(true);
  };

  const handleKeresesClose = () => {
    setKeresesOpen(false);
  };

  const handleKategoriakToggle = () => {
    kategoriakOpen? handleKategoriakClose() : handleKategoriakOpen();
  }
  
  const handleAccountDropdownOpen = () => {
    hideSnack();
    handleKategoriakClose();
    closeKosar();
    setAccountDropdownOpen(true);
  };

  const handleAccountDropdownClose = (event) => {
    setAccountDropdownOpen(false);
  };
  
  const handleKosarOpen = () => {
    handleKategoriakClose();
    handleAccountDropdownClose();
    hideSnack();
    openKosar();
  }

  return (
    <div id="header">
      <Slide appear={false} direction="down" in={!hidden}>
        <AppBar position="fixed" className={elevated ? "elevated" : ""}>
          <Toolbar className="header__wrapper">
            <div className="header__buttons-left">
              <Link to="/" className="header__brand" onClick={handleKategoriakClose}>
                <img alt="Proshop logo" src="../images/logo.svg" width="40px" height="40px"></img>
                <Typography variant="h5">
                  Proshop
                </Typography>
              </Link>
              {isMobile? 
                <IconButton onClick={handleKategoriakToggle}>
                  <IconChevronDown className={kategoriakOpen? "rotate in" : "rotate"}/>
                </IconButton>
                :
                <Button
                  className="hasIcon kategoriakDropdownButton"
                  onMouseEnter={handleKategoriakOpen}>
                  <IconChevronDown></IconChevronDown>
                  Kategóriák
                </Button>
              }
            </div>
            <Search
              keresesOpen={keresesOpen}
              handleOpen={handleKeresesOpen}
              handleClose={handleKeresesClose}
            />
            <div className="header__buttons-right">
              {!isMobile ?
                user ?
                  <AccountDropdown
                    location={location}
                    open={accountDropdownOpen}
                    handleOpen={handleAccountDropdownOpen}
                    handleClose={handleAccountDropdownClose}
                    hideSnack={hideSnack}
                  />
                  :
                  <Button className="hasIcon" onClick={openLoginModal}>
                    <IconUser></IconUser>
                    Bejelentkezés
                  </Button>
                : null
              }
              {isMobile ?
                kosarOpen ?
                  <IconButton onClick={closeKosar}>
                    <IconX></IconX>
                  </IconButton>
                  :
                  <IconButton onClick={handleKosarOpen}>
                    <Badge key={kosar} badgeContent={Object.keys(kosar).length} color="primary">
                      <IconShoppingCart></IconShoppingCart>
                    </Badge>
                  </IconButton>
                :
                <IconButton onMouseEnter={handleKosarOpen} onClick={handleKosarOpen}>
                  <Badge key={kosar} badgeContent={Object.keys(kosar).length} color="primary">
                    <IconShoppingCart></IconShoppingCart>
                  </Badge>
                </IconButton>
              }
            </div>
          </Toolbar>
        </AppBar>
      </Slide>
      <KategoriakDrawer
        kategoriakOpen={kategoriakOpen}
        handleKategoriakClose={handleKategoriakClose}
        isMobile={isMobile}
        openLoginModal={openLoginModal}
        kategoriakDrawerRef={kategoriakDrawerRef}
      />
      <Drawer anchor="right"
              open={kosarOpen}
              onClose={closeKosar}
              ModalProps={{
                container: document.getElementById('header'),
                disableEnforceFocus: true,
                keepMounted: true,
                BackdropProps: {
                  onMouseEnter: closeKosar
                }
              }}>
        <div ref={kosarDrawerRef} className="lightScrollbar">
          <Kosar
            openLoginModal={openLoginModal}
            showSnack={showSnack}/>
        </div>
        <Flipped flipId={"rendeles"}>
          <div className="rendbg"/>
        </Flipped>
      </Drawer>
    </div>
  );
}

const KategoriakDrawer = memo(({ kategoriakOpen, handleKategoriakClose, isMobile, openLoginModal, kategoriakDrawerRef }) => {
  const { user } = useContext(UserContext);
  
  return (
    <Drawer anchor="top"
            /*variant={(location.pathname === "/") ? "persistent" : "temporary"}
            open={(location.pathname === "/") ? true : kategoriakOpen}*/
            open={kategoriakOpen}
            onClose={handleKategoriakClose}
            ModalProps={{
              container: document.getElementById('header'),
              disableEnforceFocus: true,
              keepMounted: true,
              BackdropProps: {
                onMouseEnter: handleKategoriakClose
              }
            }}>
      <div ref={kategoriakDrawerRef} className="kategoriak">
        <Container>
          <ul className="kategoriakWrapper">
            <Kategoriak handleKategoriakClose={handleKategoriakClose} />
          </ul>
        </Container>
      </div>
      {isMobile ?
        <div className="kategoriak-mobile__FiokButton">
          {user ?
            <Link to="/fiok" onClick={handleKategoriakClose}>
              <Button className="big secondary">
                <div className="hasIcon">
                  <IconUser />
                  Saját fiók (beállítások, rendelések)  
                </div>
                <IconChevronRight />
              </Button>
            </Link>
            :
            <Button className="big secondary" onClick={openLoginModal}>
              <div className="hasIcon">
                <IconUser></IconUser>
                Bejelentkezés
              </div>
              <IconChevronRight />
            </Button>
          }
        </div> : null
      }
    </Drawer>
  )
})

function AccountDropdown({ open, handleOpen, handleClose }) {
  const anchorRef = useRef(null);
  const { user, setUser } = useContext(UserContext);

  const logOut = (event) => {
    event.preventDefault();
    handleClose();
    setUser("");
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Link to="/fiok">
        <Button
          className="hasIcon"
          ref={anchorRef}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onMouseEnter={handleOpen}>
          <IconUser></IconUser>
          Saját fiók
        </Button>
      </Link>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper elevation={3}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="fiokDropdown"
                          onMouseLeave={handleClose}>
                  <li className="loggedInAs">
                    <p>{user.nev}</p>
                  </li>
                  <PageLinks handleClose={handleClose}/>
                  <li className="pageLink logOut" onClick={logOut}>
                    <Button className="hasIcon">
                      <IconLogout size={25}></IconLogout>
                      Kijelentkezés
                    </Button>
                  </li>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
