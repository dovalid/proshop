import { useState, useEffect, useContext } from "react";
import { TermekkategoriakProvider } from "./Providers/KategoriakContext";
import { KosarContext, KosarProvider } from "./Providers/KosarContext";
import { UserContext, UserProvider } from "./Providers/UserContext";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import LoginModal from "./Components/Login";
import Kezdooldal from "./Kezdooldal";
import Kategoriaoldal from "./Kategoriaoldal";
import Termekoldal from "./Termekoldal";
import Rendeles from "./Rendeles";
import Fiok from "./Fiok";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import { Flipper } from "react-flip-toolkit";
import { createBrowserHistory } from "history";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import {
  ThemeProvider,
  StylesProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { IconX } from "tabler-icons";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "rgba(74, 0, 224, 1)",
    },
    secondary: {
      main: "rgba(74, 0, 224, 1)",
    },
  },
  typography: {
    fontFamily: "Open Sans",
  },
});

const history = createBrowserHistory();

const App = () => {
  const isMobile = useMediaQuery('(max-width:700px)');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [snackPack, setSnackPack] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessageInfo, setSnackMessageInfo] = useState(undefined);

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  useEffect(() => {
    if (snackPack.length && !snackMessageInfo) {
      // Set a new snack when we don't have an active one
      setSnackMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setSnackOpen(true);
    } else if (snackPack.length && snackMessageInfo && snackOpen) {
      // Close an active snack when a new one is added
      setSnackOpen(false);
    }
  }, [snackPack, snackMessageInfo, snackOpen]);

  const handleSnackOpen = (message, classes) => {
    setSnackPack((prev) => [...prev, { message, classes, key: new Date().getTime() }]);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const handleSnackExited = () => {
    setSnackMessageInfo(undefined);
  };

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <TermekkategoriakProvider>
          <KosarProvider>
            <UserProvider>
              <Router history={history}>
                <Route
                  render={({ location, search }) => {
                    return (
                      <Flipper
                        flipKey={`${location.pathname}-${location.search}`}
                        decisionData={{
                          location,
                          search,
                        }}
                        //debug={true}
                        className={
                          "appWrapper " +
                          (location.pathname.startsWith("/termek")
                            ? "hiddenOverflow"
                            : "")
                        }
                      >
                        <Header
                          isMobile={isMobile}
                          openLoginModal={openLoginModal}
                          showSnack={handleSnackOpen}
                          hideSnack={handleSnackClose}
                        />

                        <Routing
                          handleSnackOpen={handleSnackOpen}
                          openLoginModal={openLoginModal}
                        />

                        <LoginModal
                          isOpen={loginModalOpen}
                          setOpen={setLoginModalOpen}
                          showSnack={handleSnackOpen}
                        />
                        <Snackbar
                          key={snackMessageInfo ? snackMessageInfo.key : undefined}
                          open={snackOpen}
                          onClose={handleSnackClose}
                          onExited={handleSnackExited}
                          autoHideDuration={2000}
                          anchorOrigin={{ vertical: "top", horizontal: "right" }}
                          message={
                            snackMessageInfo ? snackMessageInfo.message : undefined
                          }
                          className={
                            snackMessageInfo ? snackMessageInfo.classes : undefined
                          }
                          action={
                            <IconButton
                              size="small"
                              aria-label="close"
                              color="inherit"
                              onClick={handleSnackClose}
                            >
                              <IconX />
                            </IconButton>
                          }
                        />
                      </Flipper>
                    );
                  }}
                />
              </Router>
            </UserProvider>
          </KosarProvider>
        </TermekkategoriakProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};

const Routing = ({ handleSnackOpen, openLoginModal }) => {
  let location = useLocation();
  const [managedLocation, setManagedLocation] = useState(location);
  const { kosar } = useContext(KosarContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (
      !location.pathname.startsWith("/termek") &&
      !location.pathname.startsWith("/checkout")
    ) {
      setManagedLocation(location);
    }
  }, [location]);

  return (
    <>
      <Switch location={managedLocation}>
        <Route exact path="/kategoria/:termekkategoria">
          <Kategoriaoldal
            key={managedLocation.pathname}
          />
          <Footer />
        </Route>
        <Route path="/fiok">
          {user ? (
            <Fiok showSnack={handleSnackOpen} />
          ) : (
            <LoginFlow openLoginModal={openLoginModal}/>
          )}
        </Route>
        <Route exact path="/">
          <Kezdooldal setmanagedLocation={setManagedLocation} />
          <Footer />
        </Route>
      </Switch>

      <Switch>
        <Route path="/checkout">
          {user && Object.keys(kosar).length > 0 ? (
            <Rendeles showSnack={handleSnackOpen}/>
          ) : (
            <LoginFlow openLoginModal={openLoginModal}/>
          )}
        </Route>
        <Route path="/termek/:termekid">
          <Termekoldal
            key={location.pathname}
            showSnack={handleSnackOpen}
            openLoginModal={openLoginModal}
          />
        </Route>
      </Switch>
    </>
  );
};

const LoginFlow = ({ openLoginModal }) => {
  useEffect(() => openLoginModal());

  return (
    <Redirect to={{ pathname: "/" }} />
  )
}

export default App;
