import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { IconChevronDown } from 'tabler-icons';
import { Tooltip } from '@material-ui/core';
import { IconInfoCircle } from 'tabler-icons';

export default function TermekSpecifikacio({ specifikacio }) {
  return (
    <div className="termekSpecifikacio" data-fade-in-up>
      <Typography variant='h5' className="card-title">
        Specifikációk
      </Typography>
      <div id="ertekelesek_container">
        <div className="card backgroundPattern">
          <div id="specifikacio_container">
            <Specifikaciok data={specifikacio} />
            {specifikacio.length > 8 ?
              <Grid
                id="teljes_specifikacio"
                container
                direction="row"
                justify="center"
                alignItems="center"
                className='teljes_specifikacio'
                onClick={() => {
                  document.getElementById('specifikacio_container').style.maxHeight = '1000px';
                  document.getElementById('teljes_specifikacio').style.display = 'none';
                } }
              >
                <Button className="hasIcon">
                  <IconChevronDown
                    color="var(--text-default-soft)"
                    strokeWidth={2.75} />
                  Teljes specifikáció
                </Button>
              </Grid>
              :
              null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Specifikaciok({ data }) {
  return data.map((specifikacio, i) => (
    <Grid key={i} container justify="space-between" className='specifikacio'>
      <div className="tooltip_specifikacio_container">
        <Typography variant="body1">
          {specifikacio.nev}
        </Typography>
        {specifikacio.leiras != null ?
          <Tooltip title={specifikacio.leiras} interactive placement="top" arrow>
            <span><IconInfoCircle size={20} color="var(--text-default-soft)"/></span>
          </Tooltip>
          : null}
      </div>
      <Typography variant="body1" className='specifikacio_ertek'>
        {specifikacio.ertek === 'true' ? "Igen" : specifikacio.ertek === 'false' ? 'Nem' : specifikacio.ertek}{specifikacio.mertekegyseg ? ` ${specifikacio.mertekegyseg}` : ''}
      </Typography>
    </Grid>
  ));
}