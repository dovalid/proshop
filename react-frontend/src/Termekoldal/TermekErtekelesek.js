import { useState, useEffect, useContext } from 'react';
import { UserContext } from "../Providers/UserContext";
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { IconStar, IconAlertCircle } from 'tabler-icons';
import Collapse from "@material-ui/core/Collapse";
import DialogContentText from "@material-ui/core/DialogContentText";


export default function TermekErtekelesek({ termekid, openLoginModal,showSnack }) {
  const { user } = useContext(UserContext);
  const [ertekelesek, setErtekelesek] = useState([]);
  const [addErtekelesModalOpen, setAddErtekelesModalOpen] = useState(false);

  const handleClickOpen = () => {
    if (user) {
      setAddErtekelesModalOpen(true);
    } else {
      openLoginModal();
      showSnack("A termék értékeléséhez be kell jelentkezned!", "info")
    }
  };

  const handleClose = () => {
    setAddErtekelesModalOpen(false);
  };
  
  useEffect(() => {
    fetchErtekelesek();
  }, [termekid]);

  function fetchErtekelesek(){
      fetch(`https://proshopwebshop2.herokuapp.com/api/rating/${ termekid }`)
      .then(response => response.json())
      .then((jsonData) => {
        setErtekelesek(jsonData.map(item => ({ date: item.datum, ertekeles: item.ertekeles, szoveg: item.szoveg, user: item.user })));
        document.getElementById('specifikacio_container').style.maxHeight = `${document.getElementById('ertekelesek_container').clientHeight}px`;
      })
      .catch((error) => console.error(error));}
  
  const atlagErtekeles = () => {
    if(ertekelesek.length > 0) {
      return (ertekelesek.reduce((prev, curr) => prev += curr.ertekeles, 0) / ertekelesek.length);
    }
    return -1;
  }

  return (
    <div className="termekErtekelesek" data-fade-in-up>
      <Typography variant='h5' className="card-title">
        Értékelések
      </Typography>
      <div id="ertekelesek_container">
        <div className="card backgroundPattern">
          {ertekelesek.length > 0 ?
            <Box className="ertekelesek">
              <Box className="ertekelesek__header">
                <div>
                  <Box className='ertekelesek__szam_container'>{atlagErtekeles().toFixed(1)}</Box>
                  <Box className='ertekelesek__csillagok_container'>
                    <Csillagok
                      csillagszam={+(atlagErtekeles())}
                      meret={28} />
                  </Box>
                </div>
                <div>
                  <Button className="secondary" onClick={handleClickOpen}>
                    Értékelem
                  </Button>
                </div>
              </Box>
              <Ertekelesek data={ertekelesek} />
            </Box>
            :
            <Box className="ertekelesek--empty">
              <Typography variant="body1">
                Ezt a terméket még senki sem értékelte, legyél te az első!
              </Typography>
              <div className="addErtekelesWrapper">
                <Button className="secondary" onClick={handleClickOpen}>
                  Értékelem
                </Button>
              </div>
              <img src="/images/reviews.svg" alt="Nincs még értékelés illusztráció"></img>
            </Box>}
        </div>
      </div>
      <AddErtekelesModal isOpen={addErtekelesModalOpen} handleClose={handleClose} showSnack={showSnack} termekid={termekid} user={user} setErtekelesek={setErtekelesek}  ertekelesek={ertekelesek} fetchErtekeles={fetchErtekelesek}/>
    </div>
  );
}

function AddErtekelesModal({isOpen, handleClose, showSnack, termekid, fetchErtekeles }) {
  const { user } = useContext(UserContext);
  const handleChange = (prop) => (event) => {
    setError(false);
    setValues({ ...values, [prop]: event.target.value });
  };

  const [error, setError] = useState(false);

  const [values, setValues] = useState({
    komment: "",
    csillag: 0
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    let date=new Date();
    //console.log(String(date.getDate()).length)
    let jelenlegi_datum=date.getFullYear()+"-"+(String(date.getMonth()).length<2 ? "0" : "")+date.getMonth()+"-"+(String(date.getDate()).length<2 ? ("0"+date.getDate()) : date.getDate())+" "+(String(date.getHours()).length<2 ? ("0"+date.getHours()) : date.getHours())+":"+(String(date.getMinutes()).length<2 ? ("0"+date.getMinutes()) : date.getMinutes())+":"+(String(date.getSeconds()).length<2 ? ("0"+date.getSeconds()) : date.getSeconds())
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({datum: jelenlegi_datum, felhasznaloId: user.id, ertekeles: values.csillag, szoveg: values.komment, termekId: parseInt(termekid), email: user.email, jelszo: user.jelszo})
    };
    fetch('https://proshopwebshop2.herokuapp.com/api/save_rating', requestOptions)
    .then(function (response) {
      console.log(response);
      if (response.status === 200) {
        showSnack("Köszönjük, hogy értékelted a terméket", "success");
        handleClose();
        fetchErtekeles();
      } else {
        setError("Nem megfelelően töltötted ki az inputokat!");
      }
    }
    )
    .catch(error=>console.log(error));
  }

  useEffect(() => {
    validateForm();
  }, [values.csillag])

  const [form, setForm] = useState({
    validForm: true,
  });

  function validateForm () {
    if(values.csillag>=1){
      setForm({ ...form, validForm: true });
    }
    else {
      setForm({ ...form, validForm: false });
    }
  }



  return (
    <Dialog open={isOpen} className={isOpen? "fadeInDown" : "fadeOutDown"} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle className="dialogTitle">
        Termék értékelése
      </DialogTitle>

      <DialogContent className="dialogContent">
        <form>
          <div id="addCsillagErtekeles" className="ertekelesek__csillagok_container">
            <Rating
              name="simple-controlled"
              value={values.csillag}
              onChange={(event, newValue) => {
                setValues({...values, csillag: newValue});
              }}
              icon={<IconStar color="#FF9900" fill="#FF9900"/>}
              emptyIcon={<IconStar/>}
            />
          </div>
          <div className="inputsContainer">
            <FormControl variant="outlined">
              <TextField
                variant="outlined"
                type="text"
                value={values.komment}
                onChange={handleChange('komment')}
                multiline
                rows={5}
                fullWidth
                placeholder="Értékeld a terméket!"
              />
            </FormControl>
          </div>
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
          <DialogActions className="buttonContainer">
          <Button className="button fullWidth primary" 
                  onClick={handleSubmit}
                  onSubmit={handleSubmit}
                  type="submit"
                  disabled={!form.validForm}>
                  
            Küldés
          </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Ertekelesek({ data }) {
  return data.map((ertekeles, i) => (
    <Ertekeles
      key={i}
      csillagok={ertekeles.ertekeles}
      felhasznalo={ertekeles.user.nev}
      idopont={`${ ertekeles.date.year }. ${ ertekeles.date.monthValue }. ${ ertekeles.date.dayOfMonth }.`}
      szoveg={ertekeles.szoveg}
    />
  ));
}

function Ertekeles(props) {
  return (
    <Box className="ertekeles">
      <Grid
        container
        justify="space-between"
        alignItems='center'
      >
        <Box component="span" style={{
          display: 'inline-flex',
          alignItems: 'center'
        }}>
          <Csillagok
            csillagszam={ props.csillagok }
            meret={25}
          />
        <Box component="span" style={{ fontSize: '14px', marginLeft: '20px' }}>{ props.felhasznalo }</Box>
        </Box>

        <Box component="span" style={{ fontSize: '14px' }}>
          { props.idopont }
        </Box>
      </Grid>

      <Box style={{marginTop: '20px'}}>
        { props.szoveg }
      </Box>
    </Box>
  );
}

function Csillagok(props) { //4.5
  let teli_csillagok = Math.floor(props.csillagszam); //4
  let csonka_csillag = null;
  let ures_csillagok = null;
  if(props.csillagszam.toString().indexOf('.') >= 0) {
    csonka_csillag = props.csillagszam - teli_csillagok; // 0.23
    ures_csillagok = 4 - teli_csillagok;
  } else {
    csonka_csillag = null;
    ures_csillagok = 5 - teli_csillagok;
  }
  /*console.log('Teli: ' + teli_csillagok);
  console.log('Csonka: ' + csonka_csillag);
  console.log('Üres: ' + ures_csillagok);*/
  return (
    <Box component="span" style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {
        [...Array(+(teli_csillagok)).keys()].map(item => (
          <IconStar
            key={item}
            size={props.meret}
            color="#FF9900"
            fill="#FF9900"
            stroke={0}
          />
        ))
      }
      {
        csonka_csillag ? <CsonkaCsillag meret={props.meret} ertek={csonka_csillag} /> : null
      }
      {
        [...Array(+(ures_csillagok)).keys()].map(item => (
          <IconStar
            key={5 + item}
            size={props.meret}
            color="#FF9900"
            fill="rgba(255, 153, 0, 0.28)"
            stroke={0}
          />
        ))
      }
    </Box>
  );
}

function CsonkaCsillag(props) {
  return (
    <>
      <Box style={{maxHeight: props.meret, maxWidth: props.ertek * props.meret, overflow: 'hidden'}}>
        <IconStar
          size={props.meret}
          fill="#FF9900"
          stroke={0}
        />
      </Box>
      <Box style={{maxHeight: props.meret, maxWidth: (1 - props.ertek) * props.meret, overflow: 'hidden', webkitTransform: 'scaleX(-1)', transform: 'scaleX(-1)'}}>
        <IconStar
          size={props.meret}
          fill="rgba(255, 153, 0, 0.28)"
          stroke={0}
        />
      </Box>
    </>
  );
}