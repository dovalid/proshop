import { useState, useEffect, memo } from "react";
import {
  Typography,
  Grid,
  Box,
  Slider,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Checkbox,
  Radio,
  FormControlLabel,
  Zoom,
  Tooltip
} from '@material-ui/core';
import { IconTrash, IconSquare, IconX } from 'tabler-icons';
import IconChecked from './IconChecked';
import Skeleton from '@material-ui/lab/Skeleton';
import { Flipped } from "react-flip-toolkit";

export default function SzuresDrawer({ specifikaciok, filterConditions, alterQueryParam, resetSzures }) {
  return (
    <div className="lightScrollbar">
      <Grid
        className="szuresheader"
        container
        alignItems="center"
        justify="space-between"
      >
        <Typography variant="h5" className="section-label">
          Szűrés
        </Typography>
        <Zoom in={Object.keys(filterConditions).length !== 0}>
          <Tooltip title='Szűrési feltétlek törlése' placement="top" arrow>
            <IconButton
              edge="end"
              disableRipple={true}
              className="iconButton--compensatePadding"
              onClick={resetSzures}>
              <IconTrash
                size={24}
                color="var(--color-red)"
                stroke={2}
                className="cimkektorleseicon"/>
            </IconButton>
          </Tooltip>
        </Zoom>
      </Grid>
      <div className="cimkekContainer">
        <SzuresCimkek
          filterConditions={filterConditions}
          alterQueryParam={alterQueryParam}/>
      </div>
      <Flipped
        flipId={"szuresek"}>
          <div>
      {
        specifikaciok.length !== 0 ?
          specifikaciok.map((szempont, i) => {
            let Component;
            switch (szempont.tipus) {
              case 'szoveg':
                Component = SzovegInput;
                break;
              case 'szam':
                Component = SzamInput;
                break;
              case 'boolean':
                Component = BooleanInput;
                break;
              default: return null;
            }
            return <Component
                      key={"szures_" + szempont.nev}
                      szempont={szempont}
                      filterConditions={filterConditions}
                      alterQueryParam={alterQueryParam} />
          })
          :
          [...Array(3).keys()].map((i) => (
            <Box key={"szuresLoader_" + i}>
              <Skeleton width="30%">
                <Box className="szuresnev">nev</Box>
              </Skeleton>
              <Skeleton width="40%"></Skeleton>
              <Skeleton width="50%"></Skeleton>
              <Skeleton width="30%"></Skeleton>
            </Box>
          ))
      }
      </div>
      </Flipped>
    </div>
  );
}

const SzuresCimkek = ({ filterConditions, alterQueryParam }) => {
  const cimkek = [];
  for (const [szuresSzempontNev, szuresSzempontErtek] of Object.entries(filterConditions)) {
    const szuresSzempontErtekek = szuresSzempontErtek.split("+");
    szuresSzempontErtekek.forEach((ertek, i) => {
      //remove funkciohoz, a szemponthoz tartozo tobbi filtert seteljuk ugy
      const tobbiSzempontErtek = [...szuresSzempontErtekek];
      tobbiSzempontErtek.splice(i, 1);

      cimkek.push({
        key: "szuresCimke_" + szuresSzempontNev + ertek,
        szuresSzempontNev,
        szuresSzempontErtek: ertek,
        removeFn: () => {
          alterQueryParam(szuresSzempontNev, tobbiSzempontErtek.join("+"));
        }
      })
    })
  }

  const onExit = (el, i, removeElement) => {
    el.classList.add("growOut");
    setTimeout(() => removeElement(), 300);
  }

  return cimkek.map((cimke) => (
    <Flipped
      key={cimke.key}
      flipId={"cimke_" + cimke.key}
      onExit={onExit}>
      <div className="cimke growIn">
        { `${cimke.szuresSzempontNev}: ${cimke.szuresSzempontErtek}` }
        <IconX
          className="cimkeicon"
          size={18}
          color="#8F8F8F"
          stroke={2.75}
          onClick={cimke.removeFn}
        />
      </div>
    </Flipped>
  ))
}

function BooleanInput({ szempont, filterConditions, alterQueryParam }) {
  const param = filterConditions[szempont.nev];
  const [value, setValue] = useState(
    param ? param : "Összes"
  )
  const opciok = [
    {label: "Összes", value: ""},
    {label: "Igen", value: "true"},
    {label: "Nem", value: "false"},
  ];

  return (
    <Box>
      <Box className="szuresnev">{szempont.nev}</Box>
      {
        opciok.map((item, i) => (
          <Grid
            key={"booleanInput_" + i}
            container
            alignItems="center"
          >
            <FormControlLabel
              value="end"
              control={
                <Radio
                  checked={item.value === value}
                  onChange={event => {
                    setValue(item.value);
                    if (item.label === "Összes") {
                      alterQueryParam(szempont.nev, "")
                    } else {
                      alterQueryParam(szempont.nev, item.value)
                    }
                  }}
                  value={item.value}
                  name={szempont.nev}
                />
              }
              label={item.label}
            />
          </Grid>
        ))
      }
    </Box>
  );
}

function SzamInput({ szempont, filterConditions, alterQueryParam }) {
  const [value, setValue] = useState([szempont.min, szempont.max])

  useEffect(() => {    
    const param = filterConditions[szempont.nev];
    setValue(
      param ? param.split("-") : [szempont.min, szempont.max]
    )
  }, [filterConditions, szempont.min, szempont.max])

  const handleChange = (newValue) => {
    alterQueryParam(szempont.nev, newValue.join("-"));
  }

  return (
    <Box>
      <Box className="szuresnev">{szempont.nev}</Box>
      <Slider
        min={szempont.min}
        max={szempont.max}
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        //doesn't animate if using onChangeCommitted for some reason
        onPointerUp={() => handleChange(value)}
        onChangeCommitted={() => handleChange(value)}
        aria-labelledby="range-slider"
        disabled={!szempont.max}
      />
      <Grid
        container
        alignItems="center"
        justify="space-between"
      >
        {
          [0, 1].map((i) => (
            <OutlinedInput
              key={szempont + "_numInput" + i}
              value={value[i]}
              type="number"
              min={szempont.min}
              max={szempont.max}
              disabled={!szempont.max}
              endAdornment={szempont.mertekegyseg ?
                <InputAdornment position="end">{szempont.mertekegyseg}</InputAdornment>
                : null}
              onChange={(event) => {
                let newValue = [...value];
                newValue[i] = event.target.value;
                setValue(newValue);
              }}
              onBlur={() => handleChange(value)} />
          )).reduce((prev, curr) => [prev, <span key={szempont + "_divider"}>-</span>, curr])
        }
      </Grid>
    </Box>
  );
}

function SzovegInput({ szempont, filterConditions, alterQueryParam }) {
  const param = filterConditions[szempont.nev];
  let selected = [];
  if (param) {
    selected = param.split("+");
  }

  const onChange = (event, item) => {
    if(event.target.checked) {
      selected = [...selected, item.nev];
    } else {
      let index = selected.indexOf(item.nev);
      if (index !== -1) {
        selected.splice(index, 1);
      }
    }
    alterQueryParam(szempont.nev, selected.join("+"));
  }

  return (
    <Box>
      <Box className="szuresnev">{ szempont.nev }</Box>
      {
        szempont.opciok ?
          szempont.opciok.map((item, i) => (
            <Grid
              key={i}
              container
              alignItems="center"
            >
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    id={item.nev}
                    checked={selected.includes(item.nev)}
                    onChange={(event) => onChange(event, item)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    checkedIcon={
                      <IconChecked/>
                    }
                    icon={
                      <IconSquare
                        size={30}
                        color="#CDCDCD"
                        stroke={2}
                      />
                    }
                  />
                }
                label={ item.nev }
              />
            </Grid>
          ))
          :
          [...Array(3).keys()].map((i) => (
            <CheckboxSkeleton key={i}/>
          ))
      }
    </Box>
  );
}

const CheckboxSkeleton = memo(() => {
  return (
    <Grid
      container
      alignItems="center"
      >
      <label className="MuiFormControlLabel-root Mui-disabled">
        <Checkbox
          disabled={true}
          icon={
            <IconSquare
              size={30}
              color="#CDCDCD"
              stroke={2}
            />
          }
        />
        <Skeleton width={Math.floor(Math.random() * 70) + 30}/>
      </label>
    </Grid>
  )
});