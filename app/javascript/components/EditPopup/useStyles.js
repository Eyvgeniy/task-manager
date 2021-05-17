import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 465,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 0,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export default useStyles;
