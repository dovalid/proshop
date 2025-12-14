import { useState } from 'react';
import { Flipped } from "react-flip-toolkit";
import Box from '@material-ui/core/Box';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import { IconChevronLeft, IconChevronRight } from 'tabler-icons';

export default function TermekKepek({ termekid, termek }) {
  const [kepIndex, setKepIndex] = useState(0);

  const koviKep = () => {
    if(kepIndex === termek.kepek.length - 1) {
      setKepIndex(0);
    } else {
      setKepIndex(kepIndex + 1);
    }
  }

  const elozoKep = () => {
    if(kepIndex === 0) {
      setKepIndex(termek.kepek.length - 1);
    } else {
      setKepIndex(kepIndex - 1);
    }
  }

  return (
    <div className="termekKepek">
      <div>
        <div className='termekKepek__main'>
          <IconButton onClick={elozoKep} className="termekKepek__prevBtn">
            <IconChevronLeft color="#ADADAD" size={38} />
          </IconButton>
          {termek.kepek ?
            <Flipped
              flipId={termekid + "_termekkep"}>
              <img src={termek.kepek[kepIndex]} alt={kepIndex + ". termék kép"}></img>
            </Flipped>
            :
            <Skeleton variant="rect" width="60%" height="100%" />}
          <IconButton onClick={koviKep} className="termekKepek__nextBtn">
            <IconChevronRight color="#ADADAD" size={38} />
          </IconButton>
        </div>
        <Box className='termekKepek__pagination'>
          <RadioGroup row>
            {termek.kepek ? termek.kepek.map((kep, i) => (
              <Radio name="valami" key={i} value={kep} checked={kepIndex === i} onClick={event => setKepIndex(i)} />
            ))
              : null}
          </RadioGroup>
        </Box>
      </div>
    </div>
  );
}