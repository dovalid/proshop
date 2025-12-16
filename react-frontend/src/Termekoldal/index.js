import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { Flipped } from "react-flip-toolkit";
import { KosarContext } from "../Providers/KosarContext";
import { UserContext } from "../Providers/UserContext";
import Footer from "../Components/Footer.js";
import anime from "animejs";
import TermekKepek from './TermekKepek';
import TermekAbout from './TermekAbout';
import TermekErtekelesek from './TermekErtekelesek';
import TermekSpecifikacio from './TermekSpecifikacio';
import { TermekForm } from '../Fiok/Adminoldal';
import Container from '@material-ui/core/Container';
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import { IconEdit, IconArrowLeft, IconTrash, IconAlertCircle } from 'tabler-icons';
import { API_BASE } from '../config';

function Termekoldal({ openLoginModal, showSnack }) {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const {termekid} = useParams();
  const [termek, setTermek] = useState(
    location.state ? {
    ...location.state[termekid]
    } : {});
  const [specifikacio, setSpecifikacio] = useState([]);
  const [mennyiseg, setMennyiseg] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const handleEditOpen = () => {
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
  };

  const openDeleteConfirmation = () => {
    setDeleteConfirmationOpen(true);
  };
  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setDeleteError(false);
  };

  const {addToKosar} = useContext(KosarContext);
  const handleKosarba = () => {
     addToKosar(termek, mennyiseg);
     showSnack("Sikeresen hozzáadva a kosárhoz", "success");
  }

  useEffect(() => {
    fetch(`${API_BASE}/products/${ termekid }`)
      .then(response => response.json())
      .then(jsonData => {
        jsonData.kepek = jsonData.kepek.slice(1,-1).split(',').map(url => url.replace(/"/g, ""));
        delete jsonData['hibernateLazyInitializer'];
        setTermek(jsonData);

        fetch(`${API_BASE}/product_cat_spec/${ jsonData.kategoriaNev }`)
          .then(response => response.json())
          .then(kategoria_specifikacioi => {
            fetch(`${API_BASE}/product_spec/${ termekid }`)
              .then(response => response.json())
              .then(termek_specifikacioi => {

                  const specek = kategoria_specifikacioi.map(kat_item => {
                    const find_termek_spec = termek_specifikacioi.find(elem => elem.specificationEntity.nev === kat_item.nev);
                    return {
                      ...kat_item,
                      ertek: find_termek_spec ? find_termek_spec.ertek : undefined
                    };
                  });
                  
                  setSpecifikacio(specek);

              })
              .catch((error) => console.error(error));
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
      
      return () => {
        const termekCard = document.getElementById("termekCard_" + termekid);
        if (termekCard) {
          anime({
            targets: [...termekCard.querySelectorAll("[data-fade-in-down]")],
            opacity: [0, 1],
            translateY: [-15, 0],
            delay: (el, i) => i * 50 + 300,
            easing: "easeOutSine",
            duration: 200,
          })
        }
      }
  }, [termekid]);

  const deleteTermek = () => {
    let data = JSON.stringify({
      id: termekid,
      email: user.email,
      jelszo: user.jelszo,
    });

    fetch(`${API_BASE}/product/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8", },
      body: data
    }).then(function (response) {
      if (response.status === 200) {
        showSnack("Termék sikeresen törölve", "success");
        handleEditClose();
      } else {
        setDeleteError("Nem sikerült törölni a terméket")
      }
    });
  };

  const onStartImmediate = (el) => {
    el.style.borderRadius = "100px";
    setTimeout(() => el.style.borderRadius = null, 200);
  }

  const onStart = el => {
    const termekCard = document.getElementById("termekCard_" + termekid);
    if (termekCard) {
      [...termekCard.querySelectorAll("[data-fade-in-down]")]
        .forEach((elem) => {
          elem.style.opacity = 0;
        });
    }
    anime({
      targets: [...el.querySelectorAll("[data-fade-in-up]")],
      opacity: [0, 1],
      translateY: [30, 0],
      delay: (el, i) => i * 70 + 500,
      easing: "easeOutSine",
      duration: 250
    })
  }

  return (
    <>
      <Flipped
        flipId={"termek_" + termekid}
        onStartImmediate={onStartImmediate}
        onStart={onStart}>
        <main className="termekPage">
          <Flipped
            inverseFlipId={"termek_" + termekid}>
            <div className="termekInner">
              <Container>
                <div className="termek__controlBar">
                  <Link
                    className="hasIcon"
                    to={`/kategoria/${
                      termek.kategoriaNev +
                      (location.state && location.state.prevParams
                        ? location.state.prevParams
                        : "")
                    }`}
                  >
                    <IconArrowLeft size={26} color="#505050" stroke={2.5} />
                    {termek.kategoriaNev}
                  </Link>
                  {user && (user.admin === true) ? (
                    <Tooltip title="Termék szerkesztése"  placement="top" arrow>
                      <IconButton onClick={handleEditOpen}>
                        <IconEdit size={26}/>
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </div>
              </Container>
              <div className="termekGrid termekTop">
                <Container>
                  <TermekKepek
                    termekid={termekid}
                    termek={termek}/>

                  <TermekAbout
                    termekid={termekid}
                    termek={termek}
                    mennyiseg={mennyiseg}
                    setMennyiseg={setMennyiseg}
                    handleKosarba={handleKosarba}/>
                </Container>
              </div>
              <div className="termekGrid termekBottom">
                <Container>
                  <TermekErtekelesek
                    showSnack={showSnack}
                    termekid={termekid}
                    openLoginModal={openLoginModal}/>

                  <TermekSpecifikacio
                    specifikacio={specifikacio}/>
                </Container>
              </div>
            </div>
          </Flipped>
          <Footer/>
        </main>
      </Flipped>
      <Drawer
        anchor="left"
        open={editOpen}
        onClose={handleEditClose}
        className="editTermekDrawer"
        >
        <div className="lightScrollbar">
          <div className="row">
            <Typography variant="h5" className="uppercase">
              Termék szerkesztése
            </Typography>
            <Tooltip title="Termék törlése"  placement="top" arrow>
              <IconButton onClick={openDeleteConfirmation}>
                <IconTrash size={26} color="var(--color-red)"/>
              </IconButton>
            </Tooltip>
          </div>
          <TermekForm
            termekId={termekid}
            defaultData={termek}
            defaultSpecifikaciok={specifikacio}
            setTermek={setTermek}
            setSpecifikacio={setSpecifikacio}
            showSnack={showSnack}
            handleEditClose={handleEditClose}>
          </TermekForm>

          <Dialog
            open={deleteConfirmationOpen}
            className={"confirmationDialog " + (deleteConfirmationOpen? "fadeInDown" : "fadeOutDown")}
            onClose={closeDeleteConfirmation}>
            <DialogTitle>
              Biztosan törölni szeretnéd a terméket?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                A művelet nem vonható vissza.
              </DialogContentText>
            </DialogContent>
            <DialogContent>
              <Collapse in={deleteError}>
                <DialogContentText className="dialogContentText hasIcon modal__error">
                  {deleteError?
                    <>
                      <IconAlertCircle/>
                      {deleteError}
                    </>
                    :
                    ""
                  }
                </DialogContentText>
              </Collapse>
            </DialogContent>
            <DialogActions>
              <Button
                className="button secondary"
                onClick={closeDeleteConfirmation}>
                Mégsem
              </Button>
              <Button
                className="button primary"
                onClick={deleteTermek}
                onSubmit={deleteTermek}
                type="submit">
                Törlés
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Drawer>
    </>
  )
}

export default Termekoldal;
