import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Kategoriak from '../Components/Kategoriak';
import TermekCard, { TermekCardLoader } from '../Components/TermekCard';
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { IconChevronDown } from "tabler-icons";

export default function Kezdooldal() {
  const [termekek, setTermekek] = useState([]);
  const loadersAmount = [...Array(15).keys()];

  useEffect(() => {
    document.getElementsByClassName("appWrapper")[0].scrollTo({ top: 0 });
    
    fetch('https://proshopwebshop2.herokuapp.com/api/get15')
    .then(response => response.json())
    .then((jsonData) => {
      setTermekek(jsonData);
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);
  
  return (
    <>
      <KategoriakSection />
      <div className="ujdonsagok">
        <Container>
          <Typography variant="h4" className="section-title">
            Újdonságok
          </Typography>
          <div className="termekGridContainer">
            {
              Object.keys(termekek).length ?
                termekek.map((termek, i) => (
                  <TermekCard
                    key={termek.id}
                    termek={termek}
                  />
                ))
                :
                loadersAmount.map((i) => (
                  <TermekCardLoader key={i}/>
                ))
            }
          </div>
        </Container>
      </div>
    </>
  )
}

function KategoriakSection() {
  const isMobile = useMediaQuery("(max-width:470px)");
  const [openOnMobile, setOpenOnMobile] = useState(false);
  const wrapperRef = useRef(null);

  const toggleOpen = () => {
    setOpenOnMobile(!openOnMobile);
  }

  useLayoutEffect(() => {
    const children = wrapperRef.current.children;
    const childHeight = children[0].getBoundingClientRect().height;
    wrapperRef.current.style.setProperty('--childHeight', `${childHeight}px`);
    wrapperRef.current.style.setProperty('--childNum', children.length);
  })

  return (
    <div className={"kategoriak persistent " + (openOnMobile ? "open" : "")}>
      <Container>
        <ul ref={wrapperRef} className="kategoriakWrapper">
          <Kategoriak />
        </ul>
        {isMobile &&
          <Button className="hasIcon--right kategoriak__openButton" onClick={toggleOpen}>
            Összes kategória
            <IconChevronDown />
          </Button>
        }
      </Container>
    </div>
  ) 
}


/* function KategoriakSection() {
  const [openOnMobile, setOpenOnMobile] = useState(false);

  const toggleOpen = () => {
    setOpenOnMobile(!openOnMobile);
  }

  return (
    <div className="kategoriak persistent">
        <Flipper flipKey={openOnMobile}>
          <Flipped flipId="landingKategoriak">
      <Container>
            <Flipped inverseFlipId="landingKategoriak">
              <ul className={"kategoriakWrapper " + (openOnMobile ? "open" : "")}>
                <Kategoriak />
              </ul>
            </Flipped>
        <Button className="hasIcon" onClick={toggleOpen}>
          <IconChevronDown />
          Összes kategória
        </Button>
      </Container>
          </Flipped>
        </Flipper>
    </div>
  ) 
} */