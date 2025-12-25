import { memo } from "react";
import { Typography } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import { Flipped } from "react-flip-toolkit";
import Skeleton from '@material-ui/lab/Skeleton';

const TermekCard = memo(({termek}) => {
  const location = useLocation();
  const termekParsed = {
    ...termek,
    kepek: termek.kepek.slice(1,-1).split(',').map(url => url.replace(/"/g, ""))
  }
  
  const shouldFlip = (prev, current) => {
    if (prev.location.pathname === current.location.pathname) {
      return true;
    } else {
      // direkt == hogy castoljon, === eltöri
      return termek.id == prev.location.pathname.split("/")[2];
    }
  }
  const shouldInvert = (prev, current) => {
    if (prev.location.pathname === current.location.pathname) {
      return false;
    } else {
      return true;
    }
  }

  const onExit = (el, i, removeElement) => {
    el.classList.add("growOut");
    setTimeout(() => removeElement(), 300);
  }

  const onAppear = (el, i) => {
    el.style.opacity = null;
    el.classList.add("growIn");
    setTimeout(() => el.classList.remove("growIn"), 300);
  }

  const onStart = (el) => {
    el.style.zIndex = 1;
    setTimeout(() => el.style.zIndex = null, 500);
  }

  return (
    <Flipped
      flipId={"termek_" + termek.id}
      shouldFlip={shouldFlip}
      shouldInvert={shouldInvert}
      onStart={onStart}
      onExit={onExit}
      onAppear={onAppear}>
      <Link
        to={{
          pathname: `/termek/${ termek.id }`,
          state: {
            [termek.id]: termekParsed,
            prevParams: location.search
          }
        }}
        className="termekCard"
        id={"termekCard_" + termek.id}
      >
        <Flipped
          inverseFlipId={"termek_" + termek.id}>
          <div className="termekCard__inner">
            <div className="termekCard__img">
              <Flipped
                flipId={termek.id + "_termekkep"}
                shouldFlip={shouldInvert}>
                <img src={termekParsed.kepek[0]} alt={termek.nev + " kép"}></img>
              </Flipped>
            </div>
            <div className="termekCard__content">
              <Typography variant="body1" className="termekCard__nev" data-fade-in-down>
                {termek.nev}
              </Typography>
              <Typography variant="h6" className="termekCard__ar" data-fade-in-down>
                {termek.ar.toLocaleString('hu-HU', { style: 'currency', currency: 'HUF', minimumFractionDigits: 0})}
              </Typography>
            </div>
          </div>
        </Flipped>
      </Link>
    </Flipped>
  );
})

export function TermekCardLoader () {
  return (
    <div className="termekCard">
      <div className="termekCard__inner">
        <div className="termekCard__img">
          <Skeleton variant="rect" width="100%" height="100%" />
        </div>
        <div className="termekCard__content">
          <Typography variant="body1" className="termekCard__nev">
            <Skeleton />
            <Skeleton width="70%"/>
          </Typography>
          <Typography variant="h6" className="termekCard__ar">
            <Skeleton width="50%"/>
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default TermekCard;