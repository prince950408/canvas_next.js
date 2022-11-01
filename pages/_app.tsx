// https://github.com/mui-org/material-ui/blob/8558ec2e55486561503f2f736f57f70eea48e044/examples/nextjs/pages/_app.js
import React from 'react';
import { AppProps } from 'next/app';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import { SnackbarProvider } from 'notistack';
import PreviewContext, {
  PreviewDispatch,
  previewContextReducer,
  previewContextInitialState
} from '../components/PreviewContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // React.createContext だと router から外れた場所からの get では
  // 共有されないもよう。
  // sessionStorage は?
  // https://ja.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down
  const [state, dispatch] = React.useReducer(
    previewContextReducer,
    previewContextInitialState,
    (init) => {
      const newState = { ...init };
      newState.validateAssets = process.env.VALIDATE_ASSETS ? true : false;
      try {
        newState.assets = JSON.parse(process.env.ASSETS || '[]');
      } catch (err) {
        console.error(`error: assets parse error: ${err.name}`);
      }
      return newState;
    }
  );

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <PreviewDispatch.Provider value={dispatch}>
        <PreviewContext.Provider value={state}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
              <Component {...pageProps} />
            </SnackbarProvider>
          </ThemeProvider>
        </PreviewContext.Provider>
      </PreviewDispatch.Provider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
};
