import { useEffect, useState, createContext } from "react";
import { API_BASE } from "../config";

const Termekkategoriak = createContext();

const TermekkategoriakProvider = ({ children }) => {
  const [kategoriak, setKategoriak] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
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