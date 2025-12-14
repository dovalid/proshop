import { useState, createContext, useEffect } from "react";
import Beallitasok from "../Fiok/Beallitasok";
import Rendeleseim from "../Fiok/Rendeleseim";
import Termekfeltoltes from "../Fiok/Adminoldal";
import { IconSettings, IconClock, IconClipboardList } from 'tabler-icons';

const UserContext = createContext();

const defaultAccountPages = [
  {
    path: "beallitasok",
    title: "Fiókbeállítások",
    icon: IconSettings,
    Component: Beallitasok,
  },
  {
    path: "rendeleseim",
    title: "Rendeléseim",
    icon: IconClock,
    Component: Rendeleseim,
  },
];

const UserProvider = ({ children }) => {
  const [user, setUserFn] = useState(null);
  const [accountPages, setAccountPages] = useState(defaultAccountPages);

  const setUser = (newUser) => {
    setUserFn(newUser);
  }

  useEffect(() => {
    if (user && user.admin === true) {
      setAccountPages([
        ...defaultAccountPages,
        {
          path: "adminoldal",
          title: "Termékfeltöltés",
          icon: IconClipboardList,
          Component: Termekfeltoltes,
        },
      ])
    } else {
      setAccountPages(defaultAccountPages);
    }
  }, [user])

  return (
    <UserContext.Provider value={{user, setUser, accountPages}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };