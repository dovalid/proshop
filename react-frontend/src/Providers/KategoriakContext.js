import { useEffect, useState, createContext } from "react";

const Termekkategoriak = createContext();

const TermekkategoriakProvider = ({ children }) => {
  const [kategoriak, setKategoriak] = useState([]);

  useEffect(() => {
    fetch('/dummy/kategoriak.json')
      .then(response => response.json())
      .then(jsonData => setKategoriak(jsonData))
      .catch(e => console.error(e))
  }, [])

  return (
    <Termekkategoriak.Provider value={kategoriak}>
      {children}
    </Termekkategoriak.Provider>
  );
};

export { Termekkategoriak, TermekkategoriakProvider };