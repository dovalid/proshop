import { useState, useContext, useLayoutEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { KosarContext } from "../Providers/KosarContext";
import { UserContext } from "../Providers/UserContext";
import { getTotal, KosarTermekek } from "../Components/Kosar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Collapse from "@material-ui/core/Collapse";
import InputAdornment from "@material-ui/core/InputAdornment";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { Flipped } from "react-flip-toolkit";
import anime from "animejs";
import { IconX, IconCreditCard, IconCash, IconAlertCircle } from "tabler-icons";
import { API_BASE } from '../config';

export default function Rendeles({ showSnack }) {
  const history = useHistory();
  const { kosar } = useContext(KosarContext);
  const { user } = useContext(UserContext);
  const [error, setError] = useState(false);
  const [values, setValues] = useState({
    vezeteknev: user.nev.split(" ")[0],
    keresztnev: user.nev.split(" ")[1],
    telefonszam: user.telszam,
    iranyitoszam: user.cim.iranyitoszam,
    varos: user.cim.varos,
    utcaHazszam: user.cim.utcaHazszam,
    emeletAjto: user.cim.ajtoszam,
    fizetesiMod: "kartya",
    megjegyzes: "",
  });

  useLayoutEffect(() => {
    //mobilon, mert ott a flipped nem triggereli
    animateInCards(document.getElementById("rendeles"));
  }, []);

  const animateInCards = (el) => {
    anime({
      targets: [...el.querySelectorAll("[data-fade-in-up]")],
      opacity: [0, 1],
      translateY: [30, 0],
      delay: (el, i) => i * 50 + 200,
      easing: "easeOutSine",
      duration: 250,
    });
  };

  const onComplete = (el, i) => {
    anime({
      targets: el.querySelectorAll(".cornerBrand")[0],
      opacity: [0, 1],
      scale: [0.5, 1],
      easing: "easeOutSine",
      delay: 100,
      transformOrigin: "left top",
      duration: 200,
    });
  };

  const onStartImmediate = (el, i) => {
    el.querySelectorAll(".cornerBrand")[0].style.opacity = 0;
  };

  return (
    <Flipped
      flipId={"rendeles"}
      onStart={animateInCards}
      onStartImmediate={onStartImmediate}
      onComplete={onComplete}
    >
      <main id="rendeles" className="rendeles">
        <div className="cornerBrand">
          <img src="./images/cornerCircle.svg" alt="Vissza a kezdőlapra" />
          <Link to="/" className="cornerBrand__logo">
            <img src="./images/logo_white.svg" alt="Proshop logo inverz" />
          </Link>
        </div>
        <Flipped inverseFlipId={"rendeles"}>
          <Container>
            <div className="fejlecContainer" data-fade-in-up>
              <Typography variant="h4" className="title">
                Rendelés
              </Typography>
              <Tooltip title="Vissza a shopba" placement="top" arrow>
                <IconButton
                  className="circleButton"
                  onClick={() => history.goBack()}
                >
                  <IconX size={14} stroke={4} />
                </IconButton>
              </Tooltip>
            </div>
            <div className="rendelesGrid">
              <div data-fade-in-up>
                <div className="rendelesStepper-container card backgroundPattern">
                  <RendelesStepper
                    values={values}
                    setValues={setValues}
                    error={error}
                    setError={setError}
                    showSnack={showSnack}
                  />
                </div>
              </div>
              <div className="rendelesTermekek">
                <div data-fade-in-up>
                  <Typography variant="h5" className="section-label">
                    Termékek
                  </Typography>
                </div>
                <Flipped flipId={"kosar"}>
                  <KosarTermekek />
                </Flipped>
                <div className="rendelesOsszegek">
                  <div data-fade-in-up>
                    <p>Részösszeg</p>
                    <p>{getTotal(kosar)}</p>
                  </div>
                  <div data-fade-in-up>
                    <p>Szállítás</p>
                    <p>0 Ft</p>
                  </div>
                  <div className="rendelesOsszegek__summary" data-fade-in-up>
                    <p>Összesen</p>
                    <Typography
                      variant="h5"
                      component="p"
                      className="rendelesOsszegek__total"
                    >
                      {getTotal(kosar)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Flipped>
      </main>
    </Flipped>
  );
}

function getSteps() {
  return ["Szállítási adatok", "Fizetési adatok", "Áttekintés"];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return SzallitasiAdatok;
    case 1:
      return FizetesiAdatok;
    case 2:
      return Attekintes;
    default:
      return null;
  }
}

function RendelesStepper({ values, setValues, error, setError, showSnack }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const steps = getSteps();

  const totalSteps = () => {
    return getSteps().length;
  };

  const completedSteps = () => {
    return completed.size;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed
          // find the first step that has been completed
          steps.findIndex((step, i) => !completed.has(i))
        : activeStep + 1;

    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);

    if (completed.size !== totalSteps()) {
      handleNext();
    }
  };

  function isStepComplete(step) {
    return completed.has(step);
  }

  let ActiveStepComponent = getStepContent(activeStep);

  const handleSubmit = () => {
    const datum = `${new Date().getFullYear()}-${(
      "0" +
      (new Date().getMonth() + 1)
    ).slice(-2)}-${("0" + new Date().getDate()).slice(-2)} ${(
      "0" + new Date().getHours()
    ).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${(
      "0" + new Date().getSeconds()
    ).slice(-2)}`;
    const data = {
      ...values,
      datum,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch(
      `${API_BASE}/save_order`,
      requestOptions
    )
      .then(function (response) {
        if (response.status == 200) {
          showSnack("Sikeres rendelés, köszönjük!");
        } else {
          setError("Hiba a rendelés mentése közben");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Stepper
        alternativeLabel
        nonLinear
        activeStep={activeStep}
        className="rendelesStepper"
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const buttonProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepButton
                onClick={handleStep(index)}
                completed={isStepComplete(index)}
                {...buttonProps}
              >
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      <div className="rendelesForm">
        <ActiveStepComponent values={values} setValues={setValues} setError={setError}/>
        <Collapse in={error}>
          <div className="hasIcon modal__error">
            {error ? (
              <>
                <IconAlertCircle />
                {error}
              </>
            ) : (
              ""
            )}
          </div>
        </Collapse>
        <div className="rendelesForm__buttonWrapper">
          {activeStep !== 0 ? (
            <Button onClick={handleBack} className="">
              Vissza
            </Button>
          ) : null}
          {activeStep === 1 || activeStep === 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className=""
            >
              Tovább
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className=""
            >
              Megrendelem
            </Button>
          )}
          {/*activeStep !== steps.length &&
            (completed.has(activeStep) ? (
              <Typography variant="caption" className="">
                Step {activeStep + 1} already completed
              </Typography>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleComplete}
              >
                {completedSteps() === totalSteps() - 1
                  ? "Finish"
                  : "Complete Step"}
              </Button>
                ))*/}
        </div>
      </div>
    </>
  );
}

function SzallitasiAdatok({ values, setValues, setError }) {
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setError(false);
  };

  return (
    <div className="inputsContainer">
      <FormControl variant="outlined" className="spanHalf">
        <TextField
          required
          label="Vezetéknév"
          variant="outlined"
          type="text"
          value={values.vezeteknev}
          onChange={handleChange("vezeteknev")}
        />
      </FormControl>
      <FormControl variant="outlined" className="spanHalf">
        <TextField
          required
          label="Keresztnév"
          variant="outlined"
          type="text"
          value={values.keresztnev}
          onChange={handleChange("keresztnev")}
        />
      </FormControl>
      <FormControl variant="outlined" className="spanHalf">
        <TextField
          required
          label="Telefonszám"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">+36</InputAdornment>
            ),
          }}
          type="number"
          value={values.telefonszam}
          onChange={handleChange("telefonszam")}
        />
      </FormControl>
      <Typography variant="h6" className="rendeles__sectionTitle">
        Cím
      </Typography>
      <FormControl variant="outlined" className="spanHalf">
        <TextField
          required
          label="Irányítószám"
          variant="outlined"
          type="number"
          value={values.iranyitoszam}
          onChange={handleChange("iranyitoszam")}
        />
      </FormControl>
      <FormControl variant="outlined" className="spanHalf">
        <TextField
          required
          label="Város"
          variant="outlined"
          type="text"
          value={values.varos}
          onChange={handleChange("varos")}
        />
      </FormControl>
      <FormControl variant="outlined" className="spanHalf">
        <TextField
          required
          label="Utca, házszám"
          variant="outlined"
          type="text"
          value={values.utcaHazszam}
          onChange={handleChange("utcaHazszam")}
        />
      </FormControl>
      <FormControl variant="outlined" className="spanHalf">
        <TextField
          required
          label="Emelet, ajtó"
          variant="outlined"
          type="text"
          value={values.emeletAjto}
          onChange={handleChange("emeletAjto")}
        />
      </FormControl>
    </div>
  );
}

function FizetesiAdatok({ values, setValues, setError }) {
  const handleAlignment = (event, newAlignment) => {
    setValues({ ...values, fizetesiMod: newAlignment });
    setError(false);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  return (
    <div className="inputsContainer">
      <ToggleButtonGroup
        value={values.fizetesiMod}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        <ToggleButton value="kartya" aria-label="centered">
          <IconCreditCard />
        </ToggleButton>
        <ToggleButton value="keszpenz" aria-label="centered">
          <IconCash />
        </ToggleButton>
      </ToggleButtonGroup>
      {values.fizetesiMod === "keszpenz" ? (
        <div>
          A fizetés az átvételkor{" "}
          <span style={{ fontWeight: "bold" }}>készpénzzel</span> fog történni.
        </div>
      ) : (
        <div>
          A fizetés az átvételkor{" "}
          <span style={{ fontWeight: "bold" }}>bankkártyával</span> fog
          történni.
        </div>
      )}
      <FormControl variant="outlined">
        <TextField
          label="Megjegyzés"
          variant="outlined"
          type="text"
          multiline
          rows={5}
          value={values.megjegyzes}
          onChange={handleChange("megjegyzes")}
        />
      </FormControl>
    </div>
  );
}

function Attekintes({ values }) {
  return (
    <div className="inputsContainer">
      <div>
        <Typography variant="h6" className="card-title">
          Személyes adatok
        </Typography>
        <div className="card">
          <div className="dataCard__contentGrid">
            <p>Vezetéknév:</p>
            <span>{values.vezeteknev ? values.vezeteknev : "-"}</span>
            <p>Keresztnév:</p>
            <span>{values.keresztnev ? values.keresztnev : "-"}</span>
            <p>Telefonszám:</p>
            <span>{values.telefonszam ? values.telefonszam : "-"}</span>
          </div>
        </div>
      </div>
      <div>
        <Typography variant="h6" className="card-title">
          Cím adatok
        </Typography>
        <div className="card">
          <div className="dataCard__contentGrid">
            <p>Irányítószám:</p>
            <span>{values.iranyitoszam ? values.iranyitoszam : "-"}</span>
            <p>Város:</p>
            <span>{values.varos ? values.varos : "-"}</span>
            <p>Utca, házszám:</p>
            <span>{values.utcaHazszam ? values.utcaHazszam : "-"}</span>
            <p>Emelet, ajtó:</p>
            <span>{values.emeletAjto ? values.emeletAjto : "-"}</span>
          </div>
        </div>
      </div>
      <div>
        <Typography variant="h6" className="card-title">
          Fizetési adatok
        </Typography>
        <div className="card">
          <div className="dataCard__contentGrid">
            <p>Fizetési mód:</p>
            <span>
              {values.fizetesiMod
                ? values.fizetesiMod === "kartya"
                  ? "Kártya"
                  : "Készpénz"
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
