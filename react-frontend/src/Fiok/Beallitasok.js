import { Fragment, useState, useEffect, useContext } from 'react';
import { UserContext } from "../Providers/UserContext";
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { IconEye, IconEyeOff } from 'tabler-icons';
import { API_BASE } from '../config';

export default function Beallitasok ({ showSnack }) {
  const { user, setUser } = useContext(UserContext);

  return(
    <>
      <div className="fejlecContainer">
        <Typography variant='h4' className="title">
          Fiókbeállítások
        </Typography>
      </div>

      <Typography variant='h5' className="card-title">
        Személyes adatok
      </Typography>
      <div className="card dataCard">
        <div className="dataCard__contentGrid">
            <p>Név:</p>
            <span>{user.nev}</span>
            <p>Email:</p>
            <span>{user.email}</span>
            <p>Telefonszam:</p>
            <span>{user.telszam ? user.telszam : "-"}</span>
        </div>
        <div className="dataCard__buttons">
          <JelszoModal
            showSnack={showSnack}
            setUser={setUser}
            jelszo={user.jelszo}
            user={user}
            />
          <AdatModal
            showSnack={showSnack}
            setUser={setUser}
            nev={user.nev}
            telefonszam={user.telszam}
            email={user.email}
            user={user}
            />
        </div>
      </div>
      
      <Typography variant='h5' className="card-title">
        Alapértelmezett szállítási cím
      </Typography>
      <div className="card dataCard">
        <p>
          {(user.cim.utcaHazszam && user.cim.utcaHazszam !== ""
            ? `${user.cim.iranyitoszam}
                ${user.cim.varos},
                ${user.cim.utcaHazszam}
                ${(user.cim.ajtoszam ? ` - ${user.cim.ajtoszam} .ajtó` : "")}`
            : "Még nincs címed beállítva")}
        </p>
        <div className="dataCard__buttons">
          <CimModal
            showSnack={showSnack}
            setUser={ setUser} 
            varos={user.cim.varos}
            utcaHazszam={user.cim.utcaHazszam}
            ajtoszam={user.cim.ajtoszam}
            iranyitoszam={user.cim.iranyitoszam}
            user={user}
            />
        </div>
      </div>
    </>
  )
}

function AdatModal({ user, setUser, nev, telefonszam, email, showSnack}) {
  const [open, setOpen] = useState(false);
  let loginnalZart=false;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if(!loginnalZart){
      setValues({
        vezeteknev: nev.split(" ")[0],
        keresztnev: nev.split(" ")[1],
        email: email,
        telefonszam: telefonszam,
      })
      setValid({
        validEmail: true,
        validTelefonszam: true,
        validKereszt: true,
        validVezetek: true
      })
    }
    setOpen(false);
  };

  const updateProfil=()=>{
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({nev: user.nev, telszam: user.telszam, email: user.email})
      };
      fetch(`${API_BASE}/update_user/${user.id}`, requestOptions)
        .then(response => response.json())
        .then(function(data) {
          if (data.id !== null) {
            setUser(data)
          }
        }
      )
  }

  const handleLogin = () => {
    loginnalZart=true;
    setUser({ ...user, nev: (values.vezeteknev+" "+values.keresztnev), telszam: values.telefonszam, email: values.email})
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({nev: (values.vezeteknev+" "+values.keresztnev), telszam: values.telefonszam, email: values.email})
    };
    fetch(`${API_BASE}/update_user/${user.id}`, requestOptions)
      .catch(error=>console.error(error))
    handleClose();
  };

  let [values, setValues] = useState({
    vezeteknev: nev.split(" ")[0],
    keresztnev: nev.split(" ")[1],
    email: email,
    telefonszam: telefonszam,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleChangeEmail = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    validationEmail();
  };



  const [valid, setValid] = useState({
    validEmail: true,
    validTelefonszam: true,
    validKereszt: true,
    validVezetek: true
  });

  useEffect(() => {
    validateForm();
  }, [valid])

  function validationEmail () {
    if(blur.emailBlur === false){
      setBlur({ ...blur, emailBlur: true });
    }
    if(values.email.length === 0) {
      setValid({ ...valid, validEmail: false });
    }
    else if(values.email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
      setValid({ ...valid, validEmail: true });
    }else{
      setValid({ ...valid, validEmail: false });
    }
  };

  function validationTelefonszam () {
    if(blur.telefonszamBlur === false){
      setBlur({ ...blur, telefonszamBlur: true });
    }
    if(values.telefonszam.toString().length !== 9 && values.telefonszam.toString().length !== 0) {
      setValid({ ...valid, validTelefonszam: false });
    }
    else{
      setValid({ ...valid, validTelefonszam: true });
    }
  };

  function validationVezetek () {
    if(blur.vezetekBlur === false){
      setBlur({ ...blur, vezetekBlur: true });
    }
    if(values.vezeteknev && values.vezeteknev.length < 4) {
      setValid({ ...valid, validVezetek: false });
    }
    else{
      setValid({ ...valid, validVezetek: true });
    }
  };

  function validationKereszt () {
    if(blur.keresztBlur === false){
      setBlur({ ...blur, keresztBlur: true });
    }
    if(values.keresztnev && values.keresztnev.length < 4) {
      setValid({ ...valid, validKereszt: false });
    }
    else{
      setValid({ ...valid, validKereszt: true });
    }
  };

  const [form, setForm] = useState({
    validForm: true,
  });

  function validateForm () {
    if(blur.emailBlur && valid.validEmail && blur.telefonszamBlur && valid.validTelefonszam && blur.vezetekBlur && valid.validVezetek && blur.keresztBlur && valid.validKereszt){
      setForm({ ...form, validForm: true });
    }
    else {
      setForm({ ...form, validForm: false });
    }
  } 



  const [blur, setBlur] = useState({
    emailBlur: true,
    telefonszamBlur: true,
    vezetekBlur: true,
    keresztBlur: true
  });

  return (
    <Fragment>
      <Tooltip title='Változtasd meg személyes adataidat.' placement="top" arrow>
        <Button className="primary" onClick={handleClickOpen}>
          Módosítás
        </Button>
      </Tooltip>
      <Dialog open={open} className={open? "fadeInDown" : "fadeOutDown"} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className="dialogTitle" id="form-dialog-title">Személyes adatok</DialogTitle>
          <form>
          <DialogContent className="dialogContent">
          <div className="inputsContainer">
            <FormControl variant="outlined" className="spanHalf">
                <TextField
                  required
                  label="Vezetéknév"
                  variant="outlined"
                  type="text"
                  value={values.vezeteknev}
                  onChange={handleChange('vezeteknev')}
                  onBlur={event => validationVezetek(event)}
                  error={!valid.validVezetek === true}
                  helperText={valid.validVezetek ? "" : "Nem megfelelő vezetéknév"}
                  labelWidth={70}
                />
            </FormControl>
            <FormControl variant="outlined" className="spanHalf">
                <TextField
                  required
                  label="Keresztnév"
                  variant="outlined"
                  type="text"
                  value={values.keresztnev}
                  onChange={handleChange('keresztnev')}
                  onBlur={event => validationKereszt(event)}
                  error={!valid.validKereszt=== true}
                  helperText={valid.validKereszt ? "" : "Nem megfelelő keresztnév"}
                  labelWidth={70}
                />
            </FormControl>
            <FormControl variant="outlined">
                <TextField
                  required
                  label="Email-cím"
                  variant="outlined"
                  type="email"
                  value={values.email}
                  onChange={handleChangeEmail('email')}
                  onBlur={event => validationEmail(event)}
                  error={!valid.validEmail === true}
                  helperText={valid.validEmail ? "" : "Nem megfelelő email-cím"}
                  labelWidth={70}
                />
            </FormControl>
            <FormControl variant="outlined">
                <TextField
                  label="Telefonszám"
                  variant="outlined"
                  type="number"
                  InputProps={{
                      startAdornment: <InputAdornment position="start">+36</InputAdornment>,}}
                  value={values.telefonszam}
                  onChange={handleChange('telefonszam')}
                  onBlur={event => validationTelefonszam(event)}
                  error={!valid.validTelefonszam === true}
                  helperText={valid.validTelefonszam ? "" : "Nem megfelelő telefonszám"}
                  labelWidth={70}
                />
            </FormControl>
          </div>
          <DialogActions className="buttonContainer">
          <Button className="button fullWidth" 
                  onClick={event => {event.preventDefault(); handleLogin(); showSnack("Sikeresen frissítetted az adataidat!", "success")}}
                  onSubmit={event => {event.preventDefault(); handleLogin();}}
                  className="primary" 
                  disabled={!form.validForm}
                  type="submit">
            Mentés
          </Button>
          </DialogActions>
        </DialogContent>
        </form>
      </Dialog>
    </Fragment>
  );
}


function CimModal({ user, setUser, varos, utcaHazszam, ajtoszam, iranyitoszam, adatok, showSnack}) {
  const [open, setOpen] = useState(false);
  let loginnalZart=false;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!loginnalZart){
      setValues({
        varos: varos,
        utcaHazszam: utcaHazszam,
        ajtoszam: ajtoszam,
        iranyitoszam: iranyitoszam
      })
      setValid({validIranyitoszam: true})
    }
    setOpen(false);
  };


  const handleLogin = () => {
    loginnalZart=true;
    setUser({ ...user, cim: {...user.cim, ...values}});
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email: user.email, jelszo: user.jelszo, id: user.cim.id, ...values})
    };
          fetch(`${API_BASE}/update_address/${user.id}`, requestOptions)
      .then(handleClose)
      .catch(error=>console.error(error))
  };

  let [values, setValues] = useState({
    varos: (varos ? varos : ""),
    utcaHazszam: (utcaHazszam ? utcaHazszam : ""),
    ajtoszam: (ajtoszam ? ajtoszam : ""),
    iranyitoszam: (iranyitoszam ? iranyitoszam : "")
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const [valid, setValid] = useState({
    validIranyitoszam: true
  });

  useEffect(() => {
    validateForm();
  }, [valid])

  

  function validationIranyitoszam () {
    if(blur.iranyitoszamBlur === false){
      setBlur({ ...blur, iranyitoszamBlur: true });
    }
    if(values.iranyitoszam.toString().length !== 4 && values.iranyitoszam.toString().length !== 0) {
      setValid({ ...valid, validIranyitoszam: false });
    }
    else{
      setValid({ ...valid, validIranyitoszam: true });
    }
  };


  const [form, setForm] = useState({
    validForm: true
  });

  function validateForm () {
    if(blur.iranyitoszamBlur && valid.validIranyitoszam){
      setForm({ ...form, validForm: true });
    }
    else {
      setForm({ ...form, validForm: false });
    }
  }

  const [blur, setBlur] = useState({
    iranyitoszamBlur: true
  });

  return (
    <Fragment>
      <Tooltip title='Változtasd meg alapértelmezett szállítási címedet!'  placement="top" arrow>
        <Button className="primary" onClick={handleClickOpen}>
          Módosítás
        </Button>
      </Tooltip>
      <Dialog open={open} className={open? "fadeInDown" : "fadeOutDown"} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className="dialogTitle" id="form-dialog-title">Alapértelmezett szállítási cím</DialogTitle>
          <form>
          <DialogContent className="dialogContent">
          <div className="inputsContainer">
            <FormControl variant="outlined" className="spanHalf">
                <TextField
                  label="Irányítószám"
                  variant="outlined"
                  type="number"
                  value={values.iranyitoszam}
                  onChange={handleChange('iranyitoszam')}
                  onBlur={event => validationIranyitoszam(event)}
                  error={!valid.validIranyitoszam === true}
                  helperText={valid.validIranyitoszam ? "" : "Nem megfelelő irányítószám"}
                  labelWidth={70}
                />
            </FormControl>
            <FormControl variant="outlined" className="spanHalf">
                <TextField
                  label="Varos"
                  variant="outlined"
                  type="text"
                  value={values.varos}
                  onChange={handleChange('varos')}
                  labelWidth={70}
                />
            </FormControl>
            <FormControl variant="outlined">
                <TextField
                  label="Utca, házszám"
                  variant="outlined"
                  type="text"
                  value={values.utcaHazszam}
                  onChange={handleChange('utcaHazszam')}
                  labelWidth={70}
                />
            </FormControl>
            <FormControl variant="outlined">
                <TextField
                  label="Ajtószám"
                  variant="outlined"
                  type="number"
                  value={values.ajtoszam}
                  onChange={handleChange('ajtoszam')}
                  labelWidth={70}
                />
            </FormControl>
          </div>
          <DialogActions className="buttonContainer">
          <Button className="button fullWidth" 
                  onClick={event => {event.preventDefault(); handleLogin(); showSnack("Sikeresen frissítetted az alapértelmezett címedet!", "success")}}
                  onSubmit={event => {event.preventDefault(); handleLogin()}} 
                  className="primary" 
                  disabled={!form.validForm}
                  type="submit">
                  
            Mentés
          </Button>
          </DialogActions>
        </DialogContent>
        </form>
      </Dialog>
    </Fragment>
  );
}

function JelszoModal({user, setUser, jelszo, adat, showSnack}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setValues({regijelszo: '',
                jelszo1: '',
                jelszo2: '',})
      setOpen(false);
  };


  const handleLogin = () => {
    setUser({ ...user, jelszo: values.jelszo1});
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({jelszo: values.jelszo2})
    };
        fetch(`${API_BASE}/update_password/${user.id}`, requestOptions)
      .catch(error=>console.error(error))
    handleClose();
  }
  


  let [values, setValues] = useState({
    regijelszo: '',
    jelszo1: '',
    jelszo2: '',
    showPassword1: false,
    showPassword2: false,
    showPassword3: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleChangeJelszo = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    //validationPassword();
  };


  const[validRegiJelszo, setValidRegiJelszo]=useState(
      true
  )

  const[validJelszo1, setValidJelszo1]= useState(
      true
  )
  const[validJelszo2, setValidJelszo2]= useState(
      true
  )

  const [blur, setBlur] = useState({
    regiBlur: false,
    jelszo1Blur: false,
    jelszo2Blur: false
  });

  useEffect(() => {
    validateForm();
  }, [values.regijelszo, values.jelszo1, values.jelszo2])

  useEffect(() => {
    validateForm();
  }, [validRegiJelszo, validJelszo1, validJelszo2])

  useEffect(() => {
    validateForm();
  }, [blur.regiBlur, blur.jelszo1Blur, blur.jelszo2Blur])

  
  function validationRegi () {
    if(blur.regiBlur === false){
      setBlur({ ...blur, regiBlur: true });
    }
    if(values.regijelszo.length === 0) {
      setValidRegiJelszo(false);
    }
    else if(values.regijelszo===jelszo) {
      setValidRegiJelszo(true);
    }else{
      setValidRegiJelszo(false);
    }
  };

  function validationPassword1 () {
    if(blur.jelszo1Blur === false){
      setBlur({ ...blur, jelszo1Blur: true });
    }
    if(values.jelszo1.length === 0) {
      setValidJelszo1(false);
    }
    else if(values.jelszo1.length >= 6) {
      setValidJelszo1(true);
    }else{
      setValidJelszo1(false);
    }
  };

  function validationPassword2 () {
    if(blur.jelszo2Blur === false){
      setBlur({ ...blur, jelszo2Blur: true });
    }
    if(values.jelszo2.length === 0) {
      setValidJelszo2(false);
    }
    else if(values.jelszo2 === values.jelszo1) {
      setValidJelszo2(true);
    }else{
      setValidJelszo2(false);
    }
  };

  function validationPasswordUjak () {
    validationPassword2();
    validationPassword1();
  };

  const [form, setForm] = useState({
    validForm: false,
  });

  function validateForm () {
    if( blur.regiBlur && blur.jelszo1Blur && blur.jelszo2Blur && validJelszo1 && validJelszo2 && validRegiJelszo ){
      setForm({ ...form, validForm: true });
    }
    else {
      setForm({ ...form, validForm: false });
    }
  }

  

  const handleClickShowPassword1 = () => {
    setValues({ ...values, showPassword1: !values.showPassword1 });
  };
  const handleClickShowPassword2 = () => {
    setValues({ ...values, showPassword2: !values.showPassword2 });
  };
  const handleClickShowPassword3 = () => {
    setValues({ ...values, showPassword3: !values.showPassword3 });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Fragment>
      <Button className="secondary" onClick={handleClickOpen}>
        Jelszó módosítása
      </Button>
      <Dialog open={open} className={open? "fadeInDown" : "fadeOutDown"} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className="dialogTitle" id="form-dialog-title">Jelszó módosítása</DialogTitle>
        <form>
          <DialogContent className="dialogContent">
          <div className="inputsContainer">
            <FormControl variant="outlined">
              <TextField
                required
                variant="outlined"
                label="Régi jelszó"
                type={values.showPassword1 ? 'text' : 'password'}
                value={values.regijelszo}
                onChange={handleChange('regijelszo')}
                InputProps={{
                  endAdornment:(
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword1}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword1 ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onBlur={event => validationRegi(event)}
                error={!validRegiJelszo === true}
                helperText={validRegiJelszo ? "" : "Nem megfelelő jelszó"}
                labelWidth={70}
              />
            </FormControl>
            <FormControl variant="outlined">
              <TextField
                required
                label="Új jelszó"
                variant="outlined"
                type={values.showPassword2 ? 'text' : 'password'}
                value={values.jelszo1}
                onChange={handleChange('jelszo1')}
                InputProps={{
                  endAdornment:(
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword2 ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onBlur={event => {validationPassword1(event); validationPassword2(event)}}
                error={!validJelszo1 === true}
                helperText={validJelszo1 ? "" : "Nem megfelelő jelszó(min. 6 karakter)"}
                labelWidth={70}
              />
            </FormControl>
            <FormControl variant="outlined">
              <TextField
                required
                label="Új jelszó mégegyszer"
                variant="outlined"
                type={values.showPassword3 ? 'text' : 'password'}
                value={values.jelszo2}
                onChange={handleChange('jelszo2')}
                InputProps={{
                  endAdornment:(
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword3}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword3 ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onBlur={event => {validationPassword2(event); validationPassword1(event)}}
                error={!validJelszo2 && blur.jelszo2Blur}
                helperText={validJelszo2 ? "" : "Nem egyeznek a jelszavak"}
                labelWidth={70}
              />
            </FormControl>
          </div>
          <DialogActions className="buttonContainer">
          <Button className="button fullWidth primary" 
                  onClick={event => {event.preventDefault(); handleLogin(); showSnack("Sikeresen megváltoztattad a jelszavad!", "success")}}
                  onSubmit={event => {event.preventDefault(); handleLogin()}}  
                  disabled={!form.validForm}>
            Mentés
          </Button>
          </DialogActions>
        </DialogContent>
        </form>
      </Dialog>
    </Fragment>
  );
}