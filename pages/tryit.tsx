import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FragmentImgTag from '../components/FragmentImgTag';
import FragmentPictureTag from '../components/FragmentPictureTag';
import FragmentCard from '../components/FragmentCard';
import FragmentMakeTestbedImgTag from '../components/FragmentMakeTestbedImgTag';
import FragmentMakeTestbedPictureTag from '../components/FragmentMakeTestbedPictTag';
import FragmentDownload from '../components/FragmentDownload';
import FragmentMake from '../components/FragmentMake';
import FragmentLinks from '../components/FragmentLinks';
import FragmentParams from '../components/FragmentParams';
import FragmentPictureInter from '../components/FragmentPictureInter';
import FragmentExport from '../components/FragmentExport';

const useStyles = makeStyles((theme) => ({
  groupName: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1)
    }
  },
  group: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1)
    }
  }
}));

export function GroupPanel({
  groupName,
  defaultExpanded = false,
  children
}: {
  groupName: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) {
  const classes = useStyles();

  return (
    <Box my={1}>
      <Accordion elevation={0} defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`group panel : ${groupName}`}
          id={`group-${groupName}`}
          IconButtonProps={{ edge: 'end' }}
        >
          <Box className={classes.groupName}>
            <Typography variant="h6">{groupName}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails style={{ padding: 0 }}>
          <Box className={classes.group}>{children}</Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

const groupList: {
  groupName: string;
  defaultExpanded?: boolean;
  group: React.ReactNode;
}[] = [
  {
    groupName: 'Preview <img> tag',
    group: <FragmentImgTag />
  },
  {
    groupName: 'Preview <picture> tag',
    group: <FragmentPictureTag />
  },
  {
    groupName: 'Preview Twitter Card',
    group: <FragmentCard />
  },
  {
    groupName: 'Make testbed for <img> tag by using current parameters',
    group: <FragmentMakeTestbedImgTag />
  },
  {
    groupName: 'Make testbed for <picture> tag by using current parameters',
    group: <FragmentMakeTestbedPictureTag />
  },
  {
    groupName: 'Download images from the current workbench',
    group: <FragmentDownload />
  },
  {
    groupName: 'Make images by using current parameters',
    group: <FragmentMake />
  },
  {
    groupName: 'URL Parameters',
    group: <FragmentParams />
  },
  {
    groupName: 'Links',
    group: <FragmentLinks />
  },
  {
    groupName: '[EXPERIMENTAL] Intermediate <picture> tag',
    group: <FragmentPictureInter />
  },
  {
    groupName: '[EXPERIMENTAL] Export',
    group: <FragmentExport />
  }
];
const TryItPage = () => {
  return (
    <Layout title="Try it">
      <Container maxWidth="md">
        <Box>
          {groupList.map(({ groupName, defaultExpanded, group }) => (
            <GroupPanel
              key={groupName}
              defaultExpanded={defaultExpanded}
              groupName={groupName}
            >
              {group}
            </GroupPanel>
          ))}
        </Box>
      </Container>
    </Layout>
  );
};

export default TryItPage;
