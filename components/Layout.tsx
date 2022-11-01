import React, { useState, useEffect, ReactNode } from 'react';
// import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from './Link';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > .MuiPapert-root > .MuiToolbar-root': {
      maxWidth: '36rem',
      padding: '0 1rem',
      margin: '0rem auto 0rem'
    },
    '& > .stickyGroupTabPanel': {
      [theme.breakpoints.up('sm')]: {
        position: 'sticky',
        top: -40,
        zIndex: theme.zIndex.appBar
      }
    },
    '& > .stickyPath': {
      [theme.breakpoints.up('sm')]: {
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar
      }
    },
    '& > .MuiPaper-root': {
      // padding: theme.spacing(1),
      position: 'static',
      width: '100%',
      '& > .MuiToolbar-root': {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        '& > .homeHeader': {
          justifyContent: 'center',
          '& > .MuiBox-root': {
            width: '100%',
            maxWidth: theme.breakpoints.values.md,
            display: 'flex',
            alignItems: 'center',
            '& > .homeHeaderTitle': {
              flexGrow: 1
            }
          }
        },
        '& > .MuiBox-root': {
          maxWidth: theme.breakpoints.values.md,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          '& > .MuiBreadcrumbs-root': {
            flexGrow: 1
          }
        },
        '& > .AboutHeader': {
          justifyContent: 'center',
          '& > .MuiBox-root': {
            width: '100%',
            maxWidth: theme.breakpoints.values.sm,
            display: 'flex',
            alignItems: 'center'
          }
        },
        '& .HomePathIcon': {
          fontSize: theme.typography.fontSize * 1.0,
          [theme.breakpoints.up('sm')]: {
            fontSize: theme.typography.fontSize * 2.0
          }
        }
      }
    }
  },
  GroupTabPanel: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    [theme.breakpoints.up('lg')]: {
      minHeight: 40
    },
    '& > .MuiBox-root': {
      // display: 'flex',
      // justifyContent: 'flex-end',
      width: '100%',
      maxWidth: theme.breakpoints.values.md,
      '& > .MuiTabs-root': {
        minHeight: 10,
        '& > div': {
          minHeight: 10,
          '& .MuiTab-root': {
            minHeight: 10,
            padding: 0,
            textTransform: 'none',
            [theme.breakpoints.up('sm')]: {
              paddingTop: theme.spacing(1),
              paddingBottom: theme.spacing(2),
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(1),
              minWidth: 100
            }
          }
        }
      }
    }
  }
}));

function HomeLabel({ asUrl }: { asUrl: string }): React.ReactElement {
  if (asUrl === '/') {
    return (
      <Box mt={1}>
        <Typography variant="inherit" color="inherit">
          {process.env.APP_NAME}
        </Typography>
      </Box>
    );
  } else if (asUrl === '/about') {
    return (
      <Box mt={1} display="flex">
        <Box mr={1}>
          <HomeIcon className="HomePathIcon" />
        </Box>
        <Typography variant="inherit" color="inherit">
          {process.env.APP_NAME}
        </Typography>
      </Box>
    );
  }
  return <HomeIcon className="HomePathIcon" />;
}

type TabLink = { label: string; href: string };
type TabLinks = TabLink[];
// const tabLinksWorkBench: TabLinks = [
//   { label: 'CodePen', href: '/codepen' },
//   { label: 'Card', href: '/card' },
//   { label: 'ShellScript', href: '/shellscript' }
// ];

type BreadCrumbsItem = {
  label: React.ReactNode;
  href: string;
};

type BreadCrumbsPath = {
  path: BreadCrumbsItem[];
  current: BreadCrumbsItem;
  groupTab?: TabLinks;
};

const breadCrumbsPath: BreadCrumbsPath[] = [
  {
    path: [],
    current: {
      label: <HomeLabel asUrl="/" />,
      href: '/'
    }
  },
  {
    path: [{ label: <HomeLabel asUrl="/workbench" />, href: '/' }],
    current: { label: 'Workbench', href: '/workbench' }
    // groupTab: tabLinksWorkBench
  },
  {
    path: [
      { label: <HomeLabel asUrl="/tryit" />, href: '/' },
      { label: 'Workbench', href: '/workbench' }
    ],
    current: { label: 'Try it', href: '/tryit' }
  },
  {
    path: [
      { label: <HomeLabel asUrl="/render" />, href: '/' },
      { label: 'Workbench', href: '/workbench' }
    ],
    current: { label: 'Render', href: '/render' }
  }
];

function getCurPath(asPath: string): BreadCrumbsPath {
  const p = asPath.split('?', 1)[0];
  const idx = breadCrumbsPath.findIndex((v) => v.current.href === p);
  if (idx >= 0) {
    return breadCrumbsPath[idx];
  }
  return breadCrumbsPath[0];
}

function getGroupTabValue(
  asPath: string,
  tabLinks?: TabLinks
): number | boolean {
  if (tabLinks) {
    const p = asPath.split('?', 1)[0];
    const idx = tabLinks.findIndex(({ href }) => href === p);
    if (idx >= 0) {
      return idx;
    }
  }
  return false;
}

function existGroupTabPanel(asPath: string) {
  // 現状はグループ(タブ)がある階層はない
  return (
    asPath === '/card' || asPath === '/codepen' || asPath === '/shellscript'
  );
}

function GroupTabPanel({
  tabLinks,
  asPath
}: {
  tabLinks?: TabLinks;
  asPath: string;
}) {
  const classes = useStyles();
  const [value] = useState<number | boolean>(
    getGroupTabValue(asPath, tabLinks)
  );

  if (tabLinks && existGroupTabPanel(asPath)) {
    return (
      <Paper className={classes.GroupTabPanel} square elevation={0}>
        <Box>
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            value={value}
          >
            {tabLinks.map((v, i) => (
              <Tab {...v} key={i} component={Link} naked />
            ))}
          </Tabs>
        </Box>
      </Paper>
    );
  }
  return <></>;
}

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const router = useRouter();
  const classes = useStyles();
  const [curPath, setCurPath] = useState<BreadCrumbsPath>(
    getCurPath(router.asPath)
  );

  useEffect(() => {
    setCurPath(getCurPath(router.asPath));
  }, [router.asPath]);

  return (
    <div className={classes.root}>
      <Head>
        <title>{`${title} - ${process.env.APP_NAME}`}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="og:title" content={`${title} - ${process.env.APP_NAME}`} />
        {process.env.APP_DESCRIPTION && (
          <meta name="description" content={process.env.APP_DESCRIPTION} />
        )}
        {process.env.APP_DESCRIPTION && (
          <meta name="og:description" content={process.env.APP_DESCRIPTION} />
        )}
        {process.env.APP_IMAGE_URL && (
          <meta property="og:image" content={process.env.APP_IMAGE_URL} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Paper
        square
        elevation={existGroupTabPanel(router.asPath) ? 1 : 0}
        className={
          existGroupTabPanel(router.asPath)
            ? 'stickyGroupTabPanel'
            : 'stickyPath'
        }
      >
        <Toolbar variant="dense">
          {router.asPath === '/' ? (
            <Box className="homeHeader">
              <Box>
                <Box className="homeHeaderTitle">
                  <Link variant="h6" color="textPrimary" href="/">
                    <HomeLabel asUrl="/" />
                  </Link>
                </Box>
                <Link variant="button" color="textSecondary" href="/about">
                  About
                </Link>
              </Box>
            </Box>
          ) : router.asPath !== '/about' ? (
            <Box>
              <Breadcrumbs aria-label="breadcrumb">
                {curPath.path.map((v) => (
                  <Link
                    variant="body2"
                    color="textSecondary"
                    key={v.href}
                    href={v.href}
                  >
                    {v.label}
                  </Link>
                ))}
                <Typography variant="body2" color="textPrimary">
                  {curPath?.current?.label}
                </Typography>
              </Breadcrumbs>
            </Box>
          ) : (
            <Box className="AboutHeader">
              <Box>
                <Link variant="h6" color="textSecondary" href="/">
                  <HomeLabel asUrl="/about" />
                </Link>
              </Box>
            </Box>
          )}
        </Toolbar>
        <GroupTabPanel tabLinks={curPath.groupTab} asPath={router.asPath} />
      </Paper>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
