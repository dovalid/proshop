import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from '../Providers/UserContext';
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

export default function MobileNavbar({ user }) {
  const location = useLocation();
  const { accountPages } = useContext(UserContext);
  const [value, setValue] = useState("beallitasok");

  useEffect(() => {
    const page = location.pathname.replace('/fiok/','');
    setValue(page);
  }, [location])

  let IconComponent = null;

  return (
    <BottomNavigation value={value} >
      {accountPages.map((page) => (
        IconComponent = page.icon,
        <BottomNavigationAction
          key={page.path}
          label={page.title}
          value={page.path}
          icon={<IconComponent />}
          component={Link}
          to={"/fiok/" + page.path}
        />
      ))}
    </BottomNavigation>
  );
}