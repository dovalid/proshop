import { useState, useEffect, useContext } from 'react';import Dialog from '@material-ui/core/Dialog';
import { API_BASE } from '../config';
import { UserContext } from "../Providers/UserContext";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Grow from '@material-ui/core/Grow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IconAlertCircle, IconEye, IconEyeOff } from 'tabler-icons';

export default function LoginModal({ isOpen, setOpen, showSnack }) {
  const { user, setUser } = useContext(UserContext);
  const [regisztracio, setRegisztracio] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: '',
    jelszo: '',
  });
  const [valid, setValid] = useState({
    nev: true,
    email: true,
    jelszo: true,
  });

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleChangeRegisztracio = () => {
    setRegisztracio(!regisztracio);
    setValues({
      email: '',
      jelszo: '',
    });
    setError(null);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setValid({ ...valid, [prop]: true });
  };

  function validateEmail () {
    if(values.email.length === 0) {
      setValid({ ...valid, email: false });
    }
    else if(values.email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
      setValid({ ...valid, email: true });
    }else{
      setValid({ ...valid, email: false });
    }
  };

  function validatePassword () {
    if(values.jelszo.length >= 6) {
      setValid({ ...valid, jelszo: true });
    } else {
      setValid({ ...valid, jelszo: false });
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    let api = API_BASE + "/";
    let successMsg = "";
    let errorMsg = "";

    if (regisztracio) {
      api += "regist";
      successMsg = "Sikeres regisztráció. Üdv a Proshopnál!";
      errorMsg = "Nem sikerült regisztrálni";
    } else {
      api += "login";
      successMsg = "Sikeres belépés. Üdv újra itt!";
      errorMsg = "Hibás felhasználónév vagy jelszó";
    }

    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...values})
    };

    fetch(api, requestOptions)
      .then(response => response.json())
      .then(function(data){
        setLoading(false);
        if (data.id!=null){
          setUser(data);
          showSnack(successMsg, "success");
          handleClose();
        }
        else {
          setError(errorMsg);
        };
      })
  }

  return (      
    <Dialog open={isOpen} className={isOpen? "fadeInDown" : "fadeOutDown"} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle className="dialogTitle" id="form-dialog-title">{regisztracio ? "Regisztrácó" : "Bejelentkezés"}</DialogTitle>
      <DialogContent className="dialogContent">
        <form>
          <Collapse in={regisztracio}>
            <Fade in={regisztracio}>
              <div className="inputsContainer">
                <FormControl variant="outlined">
                  <TextField
                    required
                    label="Név"
                    variant="outlined"
                    type="text"
                    value={values.nev}
                    onChange={handleChange('nev')}
                  />
                </FormControl>
              </div>
            </Fade>
          </Collapse>
          <div className="inputsContainer">
            <FormControl variant="outlined">
              <TextField
                required
                autoFocus
                label="Email-cím"
                variant="outlined"
                type="email"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={validateEmail}
                error={!valid.email === true}
                helperText={valid.email ? "" : "Nem megfelelő email-cím"}
              />
            </FormControl>
            <FormControl variant="outlined">
              <TextField
                required
                label="Jelszó"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={values.jelszo}
                onChange={handleChange('jelszo')}
                onBlur={validatePassword}
                error={valid.jelszo ? false : true}
                helperText={valid.jelszo ? "" : "A jelszónak minimum 6 karakternek kell lennie."}
                InputProps={{
                  endAdornment:(
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <IconEye /> : <IconEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </div>
          <DialogContentText className="dialogContentText">
            {regisztracio?
              <div>Ha már van fiókod, <span className="span" onClick={handleChangeRegisztracio}>  lépj be. </span></div>
              :
              <div>Ha még nincs fiókod, <span className="span" onClick={handleChangeRegisztracio}>  regisztrálj. </span></div>
            }
          </DialogContentText>
          <Collapse in={error}>
            <DialogContentText className="dialogContentText hasIcon modal__error">
              {error?
                <>
                  <IconAlertCircle/>
                  {error}
                </>
                :
                ""
              }
            </DialogContentText>
          </Collapse>
          <DialogActions className="buttonContainer">
          <Button className="button fullWidth primary"
                  onClick={handleSubmit}
                  onSubmit={handleSubmit}
                  type="submit"
                  disabled={loading}
            >
            <Grow in={loading}>
              <CircularProgress color="white"/>
            </Grow>
            {regisztracio ? "Regisztráció" : "Belépés"}
          </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}