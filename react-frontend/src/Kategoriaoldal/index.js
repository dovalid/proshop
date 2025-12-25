import { useState, useEffect, useContext } from "react";
import SzuresDrawer from "./Szures";
import { useParams, useLocation, useHistory } from "react-router-dom";
import TermekCard, { TermekCardLoader } from '../Components/TermekCard';
import {
  Typography,
  Container,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import qs from "qs";
import { IconFilter } from "tabler-icons";
import { Termekkategoriak } from "../Providers/KategoriakContext";
import { API_BASE } from '../config';

export default function Kategoriaoldal () {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const history = useHistory();
  const location = useLocation();
  const termekkategoria = useParams().termekkategoria;
  const kategoriaData = useContext(Termekkategoriak).find(k => k.nev === termekkategoria);
  const [specifikaciok, setSpecifikaciok] = useState(
    kategoriaData ?
      [
        {nev: "Ár", tipus: "szam", mertekegyseg: "Ft"},
        {nev: "Gyártó", tipus: "szoveg"},
        ...kategoriaData.spec
      ] : []
  );
  const [termekek, setTermekek] = useState([]);
  const [szuresDrawerOpen, setSzuresDrawerOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState({});
  const [sortBy, setSortBy] = useState();
  const loadersAmount = [...Array(10).keys()];

  const handleSzuresDrawerToggle = () => {
    setSzuresDrawerOpen(!szuresDrawerOpen);
  };

  useEffect(() => {
    document.getElementsByClassName("appWrapper")[0].scrollTo({ top: 0 });

    syncStateWithRoute(qs.parse(location.search, { ignoreQueryPrefix: true }));

    fetch(`${API_BASE}/product/${ termekkategoria }`)
      .then(response => response.json())
      .then((newTermekek) => {
        newTermekek.forEach(termek => {
          fetch(`${API_BASE}/product_spec/${ termek.id }`)
            .then(response => response.json())
            .then((termekSpecek) => {
              termek.specifikacio = {
                "Ár": { ertek: termek.ar, tipus: "szam" },
                "Gyártó": { ertek: termek.gyartoNev, tipus: "szoveg" }
              };
              termekSpecek.forEach((spec) => {
                const { nev, mertekegyseg, tipus, leiras } = spec.specificationEntity;
                termek.specifikacio[nev] = { mertekegyseg, tipus, leiras, ertek: spec.ertek };
              });
            })
        });
        setTermekek(newTermekek);
        const minAr = Math.min(...newTermekek.map(termek => termek.ar));
        const maxAr = Math.max(...newTermekek.map(termek => termek.ar));
        const gyartok = newTermekek
          .map((termek) => ({ nev: termek.gyartoNev, ertek: false }))
          .filter(
            (gyarto, i, self) =>
              self
                .map((gyarto) => JSON.stringify(gyarto))
                .indexOf(JSON.stringify(gyarto)) === i
          );
        if (kategoriaData) {
          // call function with Ár and Gyártó removed
          const [,, ...slicedSpecifikaciok] = specifikaciok;
          fetchSpecOptions(slicedSpecifikaciok, minAr, maxAr, gyartok);
        } else {
          fetch(`${API_BASE}/product_cat_spec/${ termekkategoria }`)
            .then(response => response.json())
            .then(jsonData => fetchSpecOptions(jsonData, minAr, maxAr, gyartok))
            .catch(e => console.error(e));
        }
      })
      .catch(e => console.error(e));
  }, [termekkategoria]);

  const fetchSpecOptions = (specifikaciok, minAr, maxAr, gyartok) => {
    let newSpecifikaciok = specifikaciok;
    Promise.all(newSpecifikaciok.map((spec) =>
      fetch(`${API_BASE}/spec_values/${termekkategoria}/${spec.nev}`)
      .then((response) => response.json())
    )).then(specSzempontValues => {
        specSzempontValues.forEach((response, i) => {
          if(newSpecifikaciok[i].tipus === 'szam') {
            newSpecifikaciok[i].max = Math.max(...(response).map(item => +(item)));
            newSpecifikaciok[i].min = Math.min(...(response).map(item => +(item)));
          } else if(newSpecifikaciok[i].tipus === 'szoveg') {
            newSpecifikaciok[i].opciok = response.map(item => ({
              nev: item,
              ertek: false
            }));
          }
        });
        setSpecifikaciok([
          {nev: "Ár", tipus: "szam", mertekegyseg: "Ft", min: minAr, max: maxAr},
          {nev: "Gyártó", tipus: "szoveg", opciok: gyartok},
          ...newSpecifikaciok
        ]);
      })
      .catch(e => console.error(e));
  }

  const resetSzures = () => {
    history.push({
      search: `?${qs.stringify({
        'sort': sortBy,
      })}`
    })
    syncStateWithRoute({'sort': sortBy});
  }

  const syncStateWithRoute = (newQueryParams) => {
    setSortBy(newQueryParams['sort']);
    delete newQueryParams['sort'];
    setFilterConditions(newQueryParams);
  }

  const alterQueryParam = (paramName, paramValue) => {
    let newQueryParams = qs.parse(location.search, { ignoreQueryPrefix: true });
    
    if (paramValue === "") {
      delete newQueryParams[paramName];
    } else {
      newQueryParams[paramName] = paramValue;
    }

    history.push({
      search: `?${qs.stringify({
        ...newQueryParams,
      })}`,
      state: {
        queryParamChange: true,
      }
    })

    syncStateWithRoute(newQueryParams);
  }

  const rendezes = (termekek) => {
    switch(sortBy) {
      case 'novekvo':
        return termekek.sort((a, b) => a.ar > b.ar ? 1 : -1);
      case 'csokkeno':
        return termekek.sort((a, b) => a.ar < b.ar ? 1 : -1);
      case 'legujabb':
        return termekek.sort((a, b) => a.id < b.id ? 1 : -1);
      case 'legregibb':
        return termekek.sort((a, b) => a.id > b.id ? 1 : -1);
      default:
        return termekek;
    }
  }

  const szures = (termekek) => {
    let leszurt = termekek;
    let filter = filterConditions;

    for (const [szuresSzempont, szuresErtek] of Object.entries(filter)) {
      if(!specifikaciok) return leszurt;
      const specObj = specifikaciok.find(spec => spec.nev === szuresSzempont);
      if (!specObj) return leszurt;
      
      switch(specObj.tipus) {
        case 'szoveg':
          leszurt = leszurt.filter(termek => {
            if (!termek.specifikacio) return false;
            const specSzempont = termek.specifikacio[szuresSzempont];
            return szuresErtek.split("+").includes(specSzempont.ertek);
          });
          break;
        case 'boolean':
          leszurt = leszurt.filter(termek => {
            if (!termek.specifikacio) return false;
            const specSzempont = termek.specifikacio[szuresSzempont];
            return specSzempont.ertek === szuresErtek;
          });
          break;
        case 'szam':
          const [ minErtek, maxErtek ] = szuresErtek.split("-");
          leszurt = leszurt.filter(termek => {
            if (!termek.specifikacio) return false;
            const specSzempont = termek.specifikacio[szuresSzempont];
            const ertek = parseInt(specSzempont.ertek);
            return (minErtek <= ertek) && (ertek <= maxErtek);
          });
          break;
        default:
          return leszurt;
      }
    };

    return leszurt;
  }

  let megjelenitettTermekek = [];

  return (
    <main className="mainWithSidebar">
      <Drawer
        id="szures"
        className="sidebar"
        anchor="left"
        variant={isMobile ? "temporary" : "permanent"}
        open={szuresDrawerOpen}
        onClose={handleSzuresDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}>
        <SzuresDrawer
          specifikaciok={specifikaciok}
          filterConditions={filterConditions}
          alterQueryParam={alterQueryParam}
          resetSzures={resetSzures}
        />
      </Drawer>
      <Container maxWidth="md">
        <div className="fejlecContainer">
          <Typography variant="h4" className="title">
            { termekkategoria }
          </Typography>
          <div className="fejlec__actions">
            {isMobile ?
              <Badge badgeContent={Object.keys(filterConditions).length} color="primary">
                <Button className="secondary hasIcon" size="small" onClick={handleSzuresDrawerToggle}>
                  <IconFilter/>
                  Szűrés
                </Button>
              </Badge> : null}
            <RendezesSelector
              sortBy={sortBy}
              alterQueryParam={alterQueryParam}/>  
          </div>
        </div>
        <div className="termekGridContainer">
          {
            megjelenitettTermekek = rendezes(szures(termekek)),
            termekek.length ?
              megjelenitettTermekek.length ?
                megjelenitettTermekek.map((termek, i) => (
                  <TermekCard
                    key={termek.id}
                    termek={termek}
                    kep={termek.kepek}
                  />
                ))
                :
                <div className="noMatchingProduct hasIcon">
                  <span className="icon">👀</span>
                  <p>Nincs a keresésnek megfelelő termék</p>
                </div>
              :
              loadersAmount.map((i) => (
                <TermekCardLoader key={i}/>
              ))
          }
        </div>
      </Container>
    </main>
  )
}

function RendezesSelector ({ sortBy, alterQueryParam }) {
  return (
    <FormControl variant="outlined" size="small">
      <InputLabel id="demo-simple-select-outlined-label">Rendezés</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={sortBy ? sortBy : 'legujabb'}
        onChange={(event) => alterQueryParam('sort', event.target.value)}
        label="Rendezés"
      >
        <MenuItem value={"legujabb"}>Legújabb legelől</MenuItem>
        <MenuItem value={"legregibb"}>Legrégibb legelől</MenuItem>
        <MenuItem value={"novekvo"}>Ár szerint növekvő</MenuItem>
        <MenuItem value={"csokkeno"}>Ár szerint csökkenő</MenuItem>
      </Select>
    </FormControl>
  );
}