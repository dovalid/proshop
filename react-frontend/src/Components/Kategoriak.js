import { useContext } from 'react';
import { Link } from "react-router-dom";
import { Termekkategoriak } from "../Providers/KategoriakContext"
import Skeleton from '@material-ui/lab/Skeleton';

export default function Kategoriak({ handleKategoriakClose }) {
  const kategoriak = useContext(Termekkategoriak);

  return (
    <>
      {
        Object.keys(kategoriak).length ?
          kategoriak.map((kategoria, i) => (
            <li key={kategoria.nev}>
              <Kategoria
                kategoria={kategoria}
                handleKategoriakClose={handleKategoriakClose} />
            </li>
          ))
          :
          [...Array(8).keys()].map((i) => (
            <li key={i}>
              <KategoriaSkeleton />
            </li>
          ))
      }
    </>
  )
}

function Kategoria({ kategoria, handleKategoriakClose }) {
  return (
    <Link to={"/kategoria/" + encodeURIComponent(kategoria.nev)}
      className="kategoriaCard"
      onClick={handleKategoriakClose}>
      <div className="imgWrapper">
        <img src={kategoria.kep} alt={kategoria.nev + " kép"}></img>
      </div>
      <h4 className="kategoria_nev">
        {kategoria.nev}
      </h4>
    </Link>
  )
}

function KategoriaSkeleton() {
  return (
    <div className="kategoriaCard">
      <div className="imgWrapper">
        <div className="square">
          <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" />
          <Skeleton variant="circle" width="110%" height="110%" />
        </div>
      </div>
      <h4 className="kategoria_nev">
        <Skeleton width="50%" height="1.8em" />
      </h4>
    </div>
  );
}
