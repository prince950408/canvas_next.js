import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Package from '../package.json';
import AboutLicense from '../src/aboutLicense';

const [licenseName, cpoyright, licenseLines] = ((): [
  string,
  string,
  string[]
] => {
  const l = AboutLicense()
    .split('\n')
    .filter((e) => e.length > 0);
  return [l[0], l[1], l.slice(2)];
})();

const AboutPage = () => (
  <Layout title="About | Test Next.js Typescript Material UI">
    <Container maxWidth="sm">
      <Box py={1} width="100%">
        <Box py={1}>
          <Typography align="center" variant="h4">
            {Package.name}
          </Typography>
          <Typography align="center">{Package.version}</Typography>
        </Box>

        <Box py={1} display="flex" justifyContent="center" width="100%">
          <Link variant="button" href="/open_source_licenses.zip">
            Open Source Licenses
          </Link>
        </Box>
        <Box>
          <Typography variant="h5">{licenseName}</Typography>
          <Typography variant="body1" paragraph>
            {cpoyright}
          </Typography>
          {licenseLines.map((v, i) => (
            <Box key={i}>
              <Typography variant="body2" paragraph>
                {v}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  </Layout>
);

export default AboutPage;
