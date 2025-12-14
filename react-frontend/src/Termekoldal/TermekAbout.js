import MennyisegControls from "../Components/MennyisegControls";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Skeleton from "@material-ui/lab/Skeleton";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { IconShieldCheck, IconBox, IconShoppingCart } from "tabler-icons";

export default function TermekAbout({
  termekid,
  termek,
  mennyiseg,
  setMennyiseg,
  handleKosarba
}) {
  return (
    <div className="termekAbout fadeInDownBig">
      <Typography variant="h3" className="reszletek_cim">
        {termek.nev ? termek.nev : <Skeleton height="1.8em" width="80%" />}
      </Typography>
      <Typography variant="body1" className="reszletek_leiras">
        {termek.leiras ? (
          termek.leiras
        ) : (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton width="60%" />
          </>
        )}
      </Typography>
      <div className="termek__tags">
        <p className="hasIcon">
          <IconShieldCheck></IconShieldCheck>
          Garancia: {termek.garancia} év
        </p>
        <p className="hasIcon">
          <IconBox></IconBox>
          Raktáron: {termek.raktaron} db
        </p>
      </div>
      <Typography variant="h4" className="reszletek_ar">
        {termek.ar ? (
          termek.ar.toLocaleString("hu-HU", {
            style: "currency",
            currency: "HUF",
            minimumFractionDigits: 0,
          })
        ) : (
          <Skeleton height="1.8em" width="30%" />
        )}
      </Typography>
      <ButtonGroup
        variant="contained"
        aria-label="contained primary button group"
      >
        <MennyisegControls
          mennyiseg={mennyiseg}
          setMennyiseg={setMennyiseg}
        ></MennyisegControls>
        <Button className="primary hasIcon big" onClick={handleKosarba}>
          <IconShoppingCart></IconShoppingCart>
          Kosárba
        </Button>
      </ButtonGroup>
    </div>
  );
}
