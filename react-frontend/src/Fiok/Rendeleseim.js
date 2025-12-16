import { Fragment, useEffect, useState, useContext } from "react";
import { UserContext } from "../Providers/UserContext";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Badge,
} from "@material-ui/core/";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Skeleton from "@material-ui/lab/Skeleton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { IconChevronDown } from "tabler-icons";
import { API_BASE } from '../config';

export default function Rendeleseim({}) {
  const isMobile = useMediaQuery("(max-width:700px)");
  const { user } = useContext(UserContext);
  const [rendelesek, setRendelesek] = useState(undefined);
  const loadersAmount = [...Array(2).keys()];

  useEffect(() => {
    fetch(`${API_BASE}/elozmenyek/${user.id}`)
      .then((response) => response.json())
      .then((json) => {
        let uj_rendelesek = json;
        Promise.all(
          uj_rendelesek.map((rendeles) =>
            fetch(`${API_BASE}/product_order/${rendeles.id}`).then((response) => response.json())
          )
        )
          .then((responseArray) => {
            responseArray.forEach((response, i) => {
              uj_rendelesek[i].termekek = response.map((termek) => ({
                mennyiseg: termek.mennyiseg,
                eredeti_ar: termek.ar,
                ...termek.productEntity,
                kepek: termek.productEntity.kepek
                  ? termek.productEntity.kepek
                      .replace(/(\{)|(\})|(")/, "")
                      .split(",")
                  : "",
              }));
            });
            console.log(uj_rendelesek);
            setRendelesek(uj_rendelesek);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }, [user]);

  return (
    <Fragment>
      <div className="fejlecContainer">
        <Typography variant="h4" className="title">
          Rendeléseim
        </Typography>
      </div>

      <div id="rendeleseim">
        {rendelesek ? (
          rendelesek.length > 0 ? (
            rendelesek.map((rendeles) => (
              <Rendeles key={rendeles.id} rendeles={rendeles} isMobile={isMobile}/>
            ))
          ) : (
            <div className="rendeles_wrapper">
              <div className="nincs_rendeles card">
                <p>Még nem rendeltél tőlünk semmit</p>
                <img src="/images/empty_orders.svg" alt="Nincs még rendelés illusztráció"></img>
              </div>
            </div>
          )
        ) : (
          loadersAmount.map((i) => (
            <RendelesSkeleton key={"rendelesSkeleton_" + i} isMobile={isMobile}/>
          ))
        )}
      </div>
    </Fragment>
  );
}

function Rendeles({ rendeles, isMobile }) {
  const statusz =
    elteltNapok(rendeles.datum) <= 4
      ? {
          value: "kiszallitas_alatt",
          title: "Kiszállítás alatt",
        }
      : {
          value: "kezbesitve",
          title: "Kézbesítve",
        };

  return (
    <div className="rendeles_wrapper">
      <div className="rendeles_header">
        <Typography variant="h5" className="card-title">
          <span>
            {rendeles.datum.year}.{rendeles.datum.monthValue}.
            {rendeles.datum.dayOfMonth}.
          </span>
          <span className="rendelesid">#{rendeles.id}</span>
        </Typography>
        {isMobile ? (
          <div className={"statusz " + statusz.value}>{statusz.title}</div>
        ) : null}
      </div>

      <Accordion className="card">
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <AvatarGroup max={3} className="termekAvatars">
            {rendeles.termekek.map((termek) => (
              <Badge
                badgeContent={termek.mennyiseg}
                invisible={termek.mennyiseg === 1}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                color="secondary"
              >
                <Avatar alt={termek.nev} src={termek.kepek[0]} />
              </Badge>
            ))}
          </AvatarGroup>
          <div className="rendelesTitleAndAr">
            <p className="rendelesTitle">
              {rendeles.termekek.map((termek) => termek.nev).join(", ")}
            </p>
            <p className="rendelesAr">
              {rendeles.termekek
                .reduce(
                  (osszesen, termek) =>
                    (osszesen += termek.mennyiseg * termek.eredeti_ar),
                  0
                )
                .toLocaleString("hu-HU", {
                  style: "currency",
                  currency: "HUF",
                  minimumFractionDigits: 0,
                })}
            </p>
          </div>
          {!isMobile ? (
            <div className={"statusz " + statusz.value}>{statusz.title}</div>
          ) : null}
        </AccordionSummary>
        <AccordionDetails>
          <div className="rendeles__adatok">
            <Typography
              variant="h6"
              className="uppercase rendeles__section-title"
            >
              Adatok
            </Typography>
            <div className="dataCard__contentGrid">
              <p>Azonosító:</p>
              <span>#{rendeles.id}</span>
              <p>Fizetési mód:</p>
              <span>{rendeles.fizetesiMod}</span>
              <p>Cím:</p>
              <span>
                {`${rendeles.cimId.iranyitoszam}
                  ${rendeles.cimId.varos},
                  ${rendeles.cimId.utcaHazszam}
                  ${(rendeles.cimId.ajtoszam ? ` - ${rendeles.cimId.ajtoszam} .ajtó` : "")}`}
              </span>
            </div>
          </div>
          <div className="rendeles__termekek">
            <Typography
              variant="h6"
              className="uppercase rendeles__section-title"
            >
              Termékek
            </Typography>
            <div className="termek_wrapper">
              {rendeles.termekek.map((termek) => (
                <div className="termek">
                  <div className="imgWrapper">
                    <img alt={termek.nev} src={termek.kepek[0]} />
                  </div>
                  <div className="nevEsArWrapper">
                    <p className="nev">{termek.nev}</p>
                    <span className="darab">{termek.mennyiseg} db</span>
                  </div>
                  <p className="ar">
                    {termek.eredeti_ar.toLocaleString("hu-HU", {
                      style: "currency",
                      currency: "HUF",
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function RendelesSkeleton({ isMobile }) {
  return (
    <div className="rendeles_wrapper">
      <div className="rendeles_header">
        <Typography variant="h5" className="card-title">
          <Skeleton>
            <span>2021.01.01.</span>
          </Skeleton>
        </Typography>
      </div>

      <Accordion className="card" disabled>
        <AccordionSummary expandIcon={<IconChevronDown />}>
          <Skeleton variant="circle" width={45} height={45} style={{"flex": "0 0 auto"}}/>
          <div className="rendelesTitleAndAr">
            <Skeleton>
              <div className="rendelesTitle">
                Itt fog megjelenni a rendelt termék neve
              </div>
            </Skeleton>
            <Skeleton>
              <div className="rendelesAr">100 000 Ft</div>
            </Skeleton>
          </div>
          {!isMobile &&
            <Skeleton variant="rect" height={30} style={{"border-radius": "40px"}}>
              <div className="statusz kiszallitas_alatt">Kiszállítás alatt</div>
            </Skeleton>
          }
        </AccordionSummary>
      </Accordion>
    </div>
  );
}

function elteltNapok({ year, monthValue, dayOfMonth }) {
  const most = Date.now();
  return (
    (most - new Date(year, monthValue - 1, dayOfMonth)) /
    (1000 * 60 * 60 * 24)
  ).toFixed(0);
}
