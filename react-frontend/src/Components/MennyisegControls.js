import IconButton from "@material-ui/core/IconButton";
import { IconMinus, IconPlus } from "tabler-icons";

export default function MennyisegControls({ mennyiseg, setMennyiseg }) {
  return (
    <div className="mennyisegControls">
      <IconButton
        onClick={() => (mennyiseg > 1 ? setMennyiseg(mennyiseg - 1) : null)}
        //disableRipple={true}
      >
        <IconMinus size={20} color="var(--text-default-soft)"></IconMinus>
      </IconButton>
      <div className="szamlalo">{mennyiseg}</div>
      <IconButton
        onClick={() => setMennyiseg(mennyiseg + 1)}
        //disableRipple={true}
      >
        <IconPlus size={20} color="var(--text-default-soft)"></IconPlus>
      </IconButton>
    </div>
  );
}
