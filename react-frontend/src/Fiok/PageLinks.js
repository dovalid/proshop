import { memo, useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../Providers/UserContext";
import Button from "@material-ui/core/Button";

export const PageLinks = memo(({ handleClose }) => {
  const { accountPages } = useContext(UserContext);

  let IconComponent = null;

  return (
    <ul>
      {accountPages.map((page) => (
        IconComponent = page.icon,
        <li key={page.path}>
          <NavLink
            to={"/fiok/" + page.path}
            onClick={handleClose}
            className="pageLink"
            activeClassName="active"
          >
            <Button className="hasIcon">
              <IconComponent size={25}></IconComponent>
              {page.title}
            </Button>
          </NavLink>
        </li>
      ))}
    </ul>
  );
});