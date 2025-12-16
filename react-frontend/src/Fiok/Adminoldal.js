import { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { Termekkategoriak } from "../Providers/KategoriakContext";
import { UserContext } from "../Providers/UserContext";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DialogContentText from "@material-ui/core/DialogContentText";
import Collapse from "@material-ui/core/Collapse";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { IconAlertCircle } from "tabler-icons";
import { API_BASE } from '../config';

export default function Termekfeltoltes({ showSnack }) {
  return (
    <>
      <div className="fejlecContainer">
        <Typography variant="h4" className="title">
          Termékfeltöltés
        </Typography>
      </div>
      <div className="card termekFeltoltesCard">
        <TermekForm
          defaultData={{
            kategoriaNev: "",
            nev: "",
            ar: "",
            leiras: "",
            gyartoNev: "",
            raktaron: "",
            garancia: "",
            kepek: [],
          }}
          showSnack={showSnack} />
      </div>
    </>
  );
}

export function TermekForm({
  termekId,
  defaultData,
  defaultSpecifikaciok,
  setTermek,
  setSpecifikacio,
  showSnack,
  handleEditClose
}) {
  const kategoriak = useContext(Termekkategoriak);
  const { user, setUser } = useContext(UserContext);
  const [values, setValues] = useState({...defaultData});
  const [specifikaciok, setSpecifikaciok] = useState(
    defaultSpecifikaciok? [...defaultSpecifikaciok] : []
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if(defaultSpecifikaciok) {      
      Promise.all(defaultSpecifikaciok.map(spec => (fetch(`${API_BASE}/spec_values/` + values.kategoriaNev + `/${ spec.nev }`)).then(response => response.json())))
        .then(responseArr => {
          responseArr.forEach((item, i) => {
            defaultSpecifikaciok[i].lehetseges_ertekek = item.map(i => ({ value: i }));
          });
          setSpecifikaciok(defaultSpecifikaciok);
        })
        .catch(e => console.error(e));
    }
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleKepekChange = (event, value) => {
    setValues({ ...values, kepek: value });
  };

  const handleKategoriaSelect = (event) => {
    handleChange("kategoriaNev")(event);
    fetch(`${API_BASE}/product_cat_spec/` + event.target.value)
        .then(response => response.json())
        .then(data => {
          Promise.all(data.map(spec => (fetch(`${API_BASE}/spec_values/` + event.target.value + `/${ spec.nev }`)).then(response => response.json())))
            .then(responseArr => {
              responseArr.forEach((spec, i) => {
                responseArr[i].forEach((spec, j) => {
                  responseArr[i][j] = {value: responseArr[i][j]};
                });
              });
              data.forEach((spec, i) => {
                data[i].lehetseges_ertekek = responseArr[i];
              });
              console.log("setelt", specifikaciok);
              setSpecifikaciok(data)
              })
            .catch(e => console.error(e));
            })
        .catch(e => console.error(e));
  };

  const handleSubmit = () => {
    let api = termekId ? `update_product/${termekId}` : "upload_product";
    let data = {...values};
    data.kepek = values.kepek.join();
    delete data['hibernateLazyInitializer'];
    data = JSON.stringify({
      ...data,
      id: termekId,
      specifikaciok: specifikaciok.map((specifikacio) => ({
        id: specifikacio.nev,
        ertek: specifikacio.ertek, 
      })),
      email: user.email,
      jelszo: user.jelszo
    });
    

    fetch("https://proshopwebshop2.herokuapp.com/api/" + api, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8", },
      body: data
    }).then(function (response) {
      if (response.status === 200) {
        if (termekId) {
          showSnack("Termék sikeresen frissítve", "success");
          setTermek(values);
          setSpecifikacio(specifikaciok);
          handleEditClose();
        }
        else {
          response.json().then(data => {
            console.log(data);
            showSnack(<Link to={`/termek/${ data.id }`}>Sikeres termékfeltöltés! Kattints ide a megtekintéshez</Link>, "success");
          });
        }
        setError(null);
      } else {
        setError("Nem megfelelően töltötted ki az inputokat!");
      }
    });
  };

  return (
    <form className="termekAdatok">
      <div className="inputsContainer">
        <FormControl variant="outlined">
          <InputLabel>
            Kategória
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={values.kategoriaNev}
            required
            labelWidth={70}
            onChange={handleKategoriaSelect}
            onBlur={handleKategoriaSelect}
          >
            {kategoriak.map((kategoria) => (
              <MenuItem key={kategoria.nev} value={kategoria.nev}>{kategoria.nev}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h5" className="card-title">
          Alapvető adatok
        </Typography>
        <FormControl variant="outlined" className="span3">
          <TextField
            required
            label="Név"
            variant="outlined"
            type="text"
            value={values.nev}
            onChange={handleChange("nev")}
          />
        </FormControl>
        <FormControl variant="outlined" className="spanHalf">
          <TextField
            required
            label="Ár"
            variant="outlined"
            type="number"
            value={values.ar}
            onChange={handleChange("ar")}
          />
        </FormControl>
        <FormControl variant="outlined" className="spanFull">
          <TextField
            required
            label="Leírás"
            variant="outlined"
            type="text"
            multiline
            value={values.leiras}
            onChange={handleChange("leiras")}
          />
        </FormControl>
        <FormControl variant="outlined" className="spanFull">
          <Autocomplete
            multiple
            freeSolo
            id="tags-outlined"
            options={[]}
            value={values.kepek}
            onChange={handleKepekChange}
            onInputChange={(event, value) => {
              if (value.slice(-1) === " ")
                handleKepekChange(event, [...values.kepek, value.slice(0, -1)]);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Képek (URLek)"
                placeholder="Másold be a kép URLjét"
                onBlur={(event) => {
                  if(event.target.value)
                    handleKepekChange(event, [...values.kepek, event.target.value]);
                }}
              />
            )}
          />
        </FormControl>
        <FormControl variant="outlined" className="spanOnMobile">
          <TextField
            required
            label="Gyártó"
            variant="outlined"
            type="text"
            value={values.gyartoNev}
            onChange={handleChange("gyartoNev")}
          />
        </FormControl>
        <FormControl variant="outlined" className="spanHalf">
          <TextField
            required
            label="Garancia(év)"
            variant="outlined"
            type="number"
            value={values.garancia}
            onChange={handleChange("garancia")}
          />
        </FormControl>
        <FormControl variant="outlined" className="spanHalf">
          <TextField
            required
            label="Raktáron(db)"
            variant="outlined"
            type="number"
            value={values.raktaron}
            onChange={handleChange("raktaron")}
          />
        </FormControl>
        <Typography variant="h5" className="card-title">
          Specifikációk
        </Typography>
        {specifikaciok.length > 0 ? (
          <>
            {specifikaciok.map((specifikacio) =>
              
              specifikacio.tipus === "boolean" ? (
                <FormControl key={specifikacio.nev} variant="outlined">
                  <InputLabel id={"select-label-" + specifikacio.nev}>
                    {specifikacio.nev}
                  </InputLabel>
                  <Select
                    labelId={"select-label-" + specifikacio.nev}
                    label={specifikacio.nev}
                    id="customized-select"
                    required
                    value={
                      specifikacio.ertek ? specifikacio.ertek : ""
                    }
                    onChange={(event) => {
                      let uj = specifikaciok;
                      uj.find((s) => s.nev === specifikacio.nev).ertek =
                        event.target.value;
                      setSpecifikaciok([...uj]);
                    }}
                  >
                    <MenuItem value={"true"}>Igen</MenuItem>
                    <MenuItem value={"false"}>Nem</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <FormControl key={specifikacio.nev} variant="outlined">
                  <Autocomplete
                    disableClearable
                    freeSolo
                    options={specifikacio.lehetseges_ertekek}
                    getOptionLabel={(option) => option.value ? option.value : ""}
                    value={ { value: specifikacio.ertek } }
                    onChange={(event, value) => {
                      let uj = [...specifikaciok];
                      uj.find(s => s.nev === specifikacio.nev).ertek = value.value;
                      setSpecifikaciok(uj);
                    }}
                    onInputChange={(event, value) => {
                      let uj = [...specifikaciok];
                      uj.find(s => s.nev === specifikacio.nev).ertek = value;
                      setSpecifikaciok(uj);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          specifikacio.mertekegyseg
                            ? `${specifikacio.nev} (${specifikacio.mertekegyseg})`
                            : specifikacio.tipus === "boolean"
                            ? `${specifikacio.nev} (igen/nem)`
                            : specifikacio.nev
                        }
                        variant="outlined"
                        required
                        type={
                          specifikacio.tipus === "szoveg" ||
                          specifikacio.tipus === "boolean"
                            ? "text"
                            : "number"
                        }
                      />
                    )}/>
                </FormControl>
              )
            )}
          </>
        ) : (
          <p className="spanFull">
            A specifikációs szempontok megjelenítéséhez először válaszd ki a
            termékkategóriát!
          </p>
        )}

        <Collapse in={error} className="spanFull">
          <DialogContentText className="dialogContentText hasIcon modal__error">
            {error ? (
              <>
                <IconAlertCircle />
                {error}
              </>
            ) : (
              ""
            )}
          </DialogContentText>
        </Collapse>
      </div>
      <DialogActions className="buttonContainer">
        {termekId ?
          <Button className="button secondary" onClick={() => handleEditClose()}>
            Mégse
          </Button> : null}
        <Button className="button primary" onClick={handleSubmit}>
          {termekId ? "Módosítások mentése" : "Termék feltöltése"}
        </Button>
      </DialogActions>
    </form>
  );
}
