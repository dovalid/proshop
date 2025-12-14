import { useState, createContext } from "react";

const KosarContext = createContext();

const KosarProvider = ({ children }) => {
  const [kosar, setKosar] = useState({});
  const [kosarOpen, setKosarOpen] = useState(false);

  const openKosar = () => {
    setKosarOpen(true);
  };

  const closeKosar = () => {
    setKosarOpen(false);
  };

  const addToKosar = (termek, mennyiseg) => {
    let uj = { ...kosar };
    uj[termek.id] = {
      nev: termek.nev,
      kep: termek.kepek[0],
      ar: termek.ar,
      mennyiseg: mennyiseg,
    };
    setKosar(uj);
    //showSnack("Sikeresen hozzáadva a kosárhoz", "success");
  };

  const removeFromKosar = (id) => {
    let uj = { ...kosar };
    delete uj[id];
    setKosar(uj);
  };

  const setMennyisegInKosar = (id, ujMennyiseg) => {
    let uj = { ...kosar };
    uj[id].mennyiseg = ujMennyiseg;
    setKosar(uj);
  };

  return (
    <KosarContext.Provider
      value={{
        kosarOpen,
        openKosar,
        closeKosar,
        kosar,
        addToKosar,
        removeFromKosar,
        setMennyisegInKosar,
      }}
    >
      {children}
    </KosarContext.Provider>
  );
};

export { KosarContext, KosarProvider };
