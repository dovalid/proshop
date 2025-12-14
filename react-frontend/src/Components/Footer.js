import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { IconBrandGitlab } from 'tabler-icons';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

export default function Footer () {
  return (
    <div className="footer">
      <div>
        <Link to="/" className="header__brand" onClick={() => window.scrollTo({ top: 0 })}>
          <img src="../images/logo.svg" width="40px" height="40px" alt="Proshop logo"></img>
          <Typography variant="h5">
            Proshop
          </Typography>
        </Link>
        <p>
          © 2020
        </p>
      </div>
      <div>
        <p>
          2020_IB153I-14
        </p>
        <LightTooltip title="GitLab repo" arrow>
          <a href="http://gitlab-okt.sed.hu/2020_IB153I-14_webshop/webshop" target="_BLANK" rel="noreferrer">
            <IconBrandGitlab/>
          </a>
        </LightTooltip>
      </div>
    </div>
  );
}

const LightTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: "var(--color-background) !important",
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
}))(Tooltip);