import { useState, useEffect, useContext, memo, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { Termekkategoriak } from "../Providers/KategoriakContext"
import { API_BASE } from '../config';
import Backdrop from '@material-ui/core/Backdrop';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { IconSearch, IconX } from 'tabler-icons';

const Search = memo(({ keresesOpen, handleOpen, handleClose }) => {
  const kategoriakObj = useContext(Termekkategoriak);
  const [kategoriak, setKategoriak] = useState([]);
  const [termekek, setTermekek] = useState([]);
  const [filteredTermekek, setFilteredTermekek] = useState([]);
  const [filteredKategoriak, setFilteredKategoriak] = useState([]);
  const [kereses, setKereses] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(response => response.json())
      .then(json => {
        setTermekek(json.map(termek => ({
          ...termek,
          kepek: termek.kepek.substr(1, termek.kepek.length - 2).split(',').map(url => url.replace(/"/g, ""))
        })))
      })
      .catch(e => console.error(e));    
  }, []);

  useLayoutEffect(() => {
    const searchEl = document.getElementById("search");
    const offset = window.innerWidth - searchEl.getBoundingClientRect().right + "px";
    searchEl.style.setProperty('--rightOffset', offset);
  })

  useEffect(() => {
    setFilteredTermekek(termekek.splice(0, 4));
  }, [termekek])

  useEffect(() => {
    const kategoriaNevek = kategoriakObj.map((k) => k.nev);
    setKategoriak(kategoriaNevek);
    setFilteredKategoriak(kategoriaNevek);
  }, [kategoriakObj])
  
  const handleToggle = () => {
    if (keresesOpen) {
      handleClose();
      setKereses("");
    } else {
      handleOpen();
    }
  }

  useEffect(() => {
    setFilteredKategoriak(
      kategoriak
        .filter((kategoria) =>
          new RegExp(ekezetek_torol(kereses.toLowerCase())).test(
            ekezetek_torol(kategoria.toLowerCase())
          )
        )
        .map((kategoria) => kategoria)
    )
    setFilteredTermekek(
      termekek
        .filter((termek) =>
          new RegExp(ekezetek_torol(kereses.toLowerCase())).test(
            ekezetek_torol(termek.nev.toLowerCase())
          )
        )
        .splice(0, 4)
        .map((termek) => termek)
    );
  }, [kereses])

  return (
    <div id="search" className={"search " + (keresesOpen? "search--open" : "")}>
      <div id="searchBar" className="searchBar hidden">
        <InputBase fullWidth={true}></InputBase>
        <IconButton disableRipple>
          <IconSearch/>
        </IconButton>
      </div>
      <div className="searchBar">
        <InputBase
          value={kereses}
          onChange={event => {
            setKereses(event.target.value);
          }}
          onFocus={handleOpen}
          fullWidth={true}
          placeholder="Mit keresel?"
        />
        <IconButton disableRipple onClick={handleToggle}>
          {keresesOpen?
            <IconX/>
            :
            <IconSearch/>
          }
        </IconButton>
      </div>
      <div className="talalatok_wrapper">
        <div className="talalatok">
          <div className="talalatok_inner">
            <div className="talalatok_kategoriak">
              <Typography variant="h6" className="talalat_cim">Kategóriák</Typography>
              <ul className="kategoria_talalatok_wrapper">
              {
                filteredKategoriak.map((kategoria) => (
                  <li key={kategoria} className="kategoria_talalat" onClick={handleClose}>
                    <Link to={`/kategoria/${ kategoria }`}>
                      { kategoria }
                    </Link>
                  </li>
                ))
              }
              </ul>
            </div>
            <div className="talalatok_termekek">
              <Typography variant="h6" className="talalat_cim">Termékek</Typography>
              <ul id="termek_talalatok_wrapper" className="termek_talalatok_wrapper">
              {
                filteredTermekek.map((termek) => (
                  <li key={termek.id} className="termek_talalat" onClick={handleClose}>
                    <Link
                      to={{
                        pathname: `/termek/${ termek.id }`,
                        state: {
                          [termek.id]: termek
                        }
                      }}>
                      <div className="talalat_kep_wrapper">
                        <img className="talalat_kep" src={termek.kepek[0]} alt={`${termek.nev}`} />
                      </div>
                      <div className="termek_talalat_adatok">
                        <Typography variant="body1" component="h5" className="termek_talalat_nev">
                          { termek.nev }
                        </Typography>
                        <Typography variant="h6" component="p" className="termek_talalat_adatok_ar">
                          { termek.ar.toLocaleString('hu-HU', { style: 'currency', currency: 'HUF', minimumFractionDigits: 0}) }
                        </Typography>
                      </div>
                    </Link>
                  </li>
                ))
              }
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Backdrop invisible={true} open={keresesOpen} onClick={handleClose}/>
    </div>
  );
});

function ekezetek_torol(str) {
  let uj = str;
  uj = uj.replace(/á/g, 'a')
         .replace(/é/g, 'e')
         .replace(/í/g, 'i')
         .replace(/ó/g, 'o')
         .replace(/ö/g, 'o')
         .replace(/ő/g, 'o')
         .replace(/ú/g, 'u')
         .replace(/ü/g, 'u')
         .replace(/ű/g, 'u');
  return uj;
}

export default Search;