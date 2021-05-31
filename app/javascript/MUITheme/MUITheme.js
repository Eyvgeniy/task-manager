import React from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const MUITheme = (props) => (
  <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
);

export default MUITheme;
