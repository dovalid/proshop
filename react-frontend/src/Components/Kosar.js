import { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { KosarContext } from "../Providers/KosarContext";
import { UserContext } from "../Providers/UserContext";
import MennyisegControls from "./MennyisegControls";
import { Typography, IconButton, Button } from "@material-ui/core";
import { IconTrash, IconArrowRight } from "tabler-icons";
import Tooltip from "@material-ui/core/Tooltip";
import { Flipped } from "react-flip-toolkit";

export function getTotal(kosar) {
  let total = 0;
  for (const termek of Object.values(kosar)) {
    total += termek.ar * termek.mennyiseg;
  }
  return total.toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
  });
}

export default function Kosar({ openLoginModal, showSnack, ...rest }) {
  let location = useLocation();
  const { user } = useContext(UserContext);
  const { kosar } = useContext(KosarContext);

  const handleRendelesOpen = (event) => {
    if (!user) {
      event.preventDefault();
      showSnack("A rendeléshez először jelentkezz be, vagy regisztrálj!");
      openLoginModal();
    }
  };

  const onComplete = (el, i) => {
    el.parentElement.parentElement.style.overflow = "overlay";
  };

  const onStartImmediate = (el, i) => {
    el.parentElement.parentElement.style.overflow = "visible";
  };

  return (
    <div {...rest} className="kosar">
      <Typography variant="h4" className="uppercase">
        Kosár
      </Typography>
      {Object.keys(kosar).length > 0 ? (
        <>
          <Flipped
            flipId={"kosar"}
            onStartImmediate={onStartImmediate}
            onComplete={onComplete}
          >
            <KosarTermekek/>
          </Flipped>
          <div className="kosarSummary">
            <div>
              <Typography
                variant="body1"
                component="h4"
                className="kosarSummary__title"
              >
                Összesen:
              </Typography>
              <Typography
                variant="h6"
                component="p"
                className="kosarSummary__amount"
              >
                {getTotal(kosar)}
              </Typography>
            </div>

            <Link
              to={{
                pathname: "/checkout",
                state: {
                  prevLocation: location,
                },
              }}
              onClick={handleRendelesOpen}
            >
              <Button className="primary hasIcon hasIcon--right big">
                Megveszem
                <IconArrowRight></IconArrowRight>
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="kosarWrapper">
            <Typography variant="body1">
              Üres a kosarad. Nézz körül a shopban!
            </Typography>
          </div>
          <img
            src="/images/empty_cart.svg"
            width="80%"
            className="kosarEmptyArt"
            alt="Üres kosár illusztráció"
          />
        </>
      )}
    </div>
  );
}

export function KosarTermekek({ ...rest }) {
  const { kosar, removeFromKosar, setMennyisegInKosar } = useContext(
    KosarContext
  );
  
  function getOsszeg(ar, mennyiseg) {
    let osszeg = ar * mennyiseg;
    return osszeg.toLocaleString("hu-HU", {
      style: "currency",
      currency: "HUF",
      minimumFractionDigits: 0,
    });
  }

  return (
    <ul {...rest} className="kosarWrapper">
      {Object.entries(kosar).map(([id, termek]) => (
        <li key={id} className="kosar-termek">
          <div className="imgWrapper">
            <img src={termek.kep} alt={termek.nev + " kép"}></img>
          </div>
          <div className="contentWrapper">
            <h4 className="termek-nev">{termek.nev}</h4>
            <p className="termek-ar">
              {getOsszeg(termek.ar, termek.mennyiseg)}
            </p>
          </div>
          <Tooltip title="Termék törlése a kosárból" placement="top" arrow>
            <IconButton
              className="removeIcon"
              onClick={() => removeFromKosar(id)}
            >
              <IconTrash color="red"></IconTrash>
            </IconButton>
          </Tooltip>
          <MennyisegControls
            mennyiseg={termek.mennyiseg}
            setMennyiseg={(ujMennyiseg) => setMennyisegInKosar(id, ujMennyiseg)}
          />
        </li>
      ))}
    </ul>
  );
}
