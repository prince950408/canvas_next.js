import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  openWithOuter: {
    display: 'block',
    '& > .MuiBox-root': {
      display: 'flex',
      alignItems: 'center',
      '& .MuiButton-root': {
        textTransform: 'none'
      },
      [theme.breakpoints.down('xs')]: {
        display: 'block',
        '&  .MuiButton-root': {
          width: '100%'
        }
      }
    },
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center'
    }
  }
}));

const TryItOn = ({
  title,
  linkButtons
}: {
  title: string;
  linkButtons: React.ReactNode[];
}) => {
  const classes = useStyles();
  return (
    <Box mx={1} p={1} className={classes.openWithOuter}>
      <Typography variant="body1">{`Try it on ${title}: `}</Typography>
      <Box>
        {linkButtons.map((v, i) => (
          <Box key={i} p={1}>
            {v}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default TryItOn;
