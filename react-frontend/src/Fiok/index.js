import { useEffect, useState, useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { UserContext } from "../Providers/UserContext";
import MobileNavbar from "./MobileNavbar";
import Footer from "../Components/Footer";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Rendeleseim from "./Rendeleseim";
import Beallitasok from "./Beallitasok";
import Adminoldal from "./Adminoldal";
import { PageLinks } from "./PageLinks";

export default function Fiok({ showSnack }) {
  const isMobile = useMediaQuery("(max-width:1024px)");
  const { user } = useContext(UserContext);

  useEffect(() => {
    document.getElementsByClassName("appWrapper")[0].scrollTo({ top: 0 });
  });

  return (
    <>
      <main id="Fiok" className="mainWithSidebar">
        {!isMobile && (
          <Drawer
            id="oldalsav"
            className="sidebar"
            anchor="left"
            variant="permanent"
          >
            <Box className="loggedInAs">
              <Typography variant="h5" className="section-label">
                {user.nev}
              </Typography>
              <Typography variant="subtitle1">{user.email}</Typography>
            </Box>
            <PageLinks />
          </Drawer>
        )}
        <Container maxWidth="md">
          <Switch>
            <Route path="/fiok/rendeleseim">
              <Rendeleseim />
            </Route>
            <Route path="/fiok/beallitasok">
              <Beallitasok showSnack={showSnack} />
            </Route>
            {user.admin && (
              <Route path="/fiok/adminoldal">
                <Adminoldal showSnack={showSnack} />
              </Route>
            )}
            <Route path="/">
              <Redirect to="/fiok/beallitasok" />
            </Route>
          </Switch>
        </Container>
      </main>
      {isMobile ? (
        <MobileNavbar />
      ) : (
        <Footer />
      )}
    </>
  );
}
