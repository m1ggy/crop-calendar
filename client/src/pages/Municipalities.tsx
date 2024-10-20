import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Link,
  Stack,
  Typography,
} from '@mui/joy'
import Header from '../components/Header'

function Municipalities() {
  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Header isDetached />
      <Stack sx={{ gap: 1, px: 10 }}>
        <Typography level="h1" textColor={'common.black'}>
          Municipalities
        </Typography>
        <Typography level="body-md" textColor={'common.black'}>
          The Crop Calendar supports the municipalities of Kabulusan, Casinsin,
          Casareal, Damo, and Asufre, each showcasing their featured crop of the
          year. Additionally, the calendar highlights other crops that are
          compatible with the unique land and conditions of these areas, helping
          farmers plan and optimize their yields.
        </Typography>
        <Typography level="body-md" textColor={'common.black'}>
          These municipalities are known for their rich agricultural heritage,
          with each region offering distinct soil and climate conditions that
          support a diverse range of crops. By focusing on both featured and
          compatible crops, the Crop Calendar helps farmers make informed
          decisions, ensuring sustainable farming practices and maximizing
          productivity throughout the year.
        </Typography>
        <AccordionGroup size="lg">
          {/* Kabulusan */}
          <Accordion>
            <AccordionSummary indicator={<ExpandMoreIcon />}>
              <Typography textColor={'common.black'}>Kabulusan</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography textColor={'common.black'}>
                Kabulusan is a low-lying barangay in Pakil, Laguna, known for
                its fertile soil, which supports rice, root crops, and
                vegetables.
              </Typography>
              <Link
                href="/municipalities/kabulusan"
                color="primary"
                textColor={'common.black'}
                fontSize={'lg'}
                fontWeight={'bolder'}
              >
                View municipality
              </Link>
            </AccordionDetails>
          </Accordion>

          {/* Casinsin */}
          <Accordion>
            <AccordionSummary indicator={<ExpandMoreIcon />}>
              <Typography textColor={'common.black'}>Casinsin</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography textColor={'common.black'}>
                Casinsin shares similar agricultural characteristics with
                Kabulusan, offering ideal conditions for diverse crop farming.
              </Typography>
              <Link
                href="/municipalities/casinsin"
                color="primary"
                textColor={'common.black'}
                fontSize={'lg'}
                fontWeight={'bolder'}
              >
                View municipality
              </Link>
            </AccordionDetails>
          </Accordion>

          {/* Casa Real */}
          <Accordion>
            <AccordionSummary indicator={<ExpandMoreIcon />}>
              <Typography textColor={'common.black'}>Casa Real</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography textColor={'common.black'}>
                Casa Real, located at a higher elevation, is known for growing
                bananas, coconuts, and other fruit-bearing crops.
              </Typography>
              <Link
                textColor={'common.black'}
                href="/municipalities/casareal"
                color="primary"
                fontSize={'lg'}
                fontWeight={'bolder'}
              >
                View municipality
              </Link>
            </AccordionDetails>
          </Accordion>

          {/* Dambo */}
          <Accordion>
            <AccordionSummary indicator={<ExpandMoreIcon />}>
              <Typography textColor={'common.black'}>Dambo</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography textColor={'common.black'}>
                Dambo benefits from nearby water sources, making it ideal for
                rice farming and other irrigation-based agriculture.
              </Typography>
              <Link
                textColor={'common.black'}
                href="/municipalities/dambo"
                color="primary"
                fontSize={'lg'}
                fontWeight={'bolder'}
              >
                View municipality
              </Link>
            </AccordionDetails>
          </Accordion>

          {/* Asufre */}
          <Accordion>
            <AccordionSummary indicator={<ExpandMoreIcon />}>
              <Typography textColor={'common.black'}>Asufre</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography textColor={'common.black'}>
                Asufre (Mabato-Azufre) is a low-lying area with water access,
                supporting rice, vegetables, and hydropower-assisted farming.
              </Typography>
              <Link
                textColor={'common.black'}
                href="/municipalities/asufre"
                color="primary"
                fontSize={'lg'}
                fontWeight={'bolder'}
              >
                View municipality
              </Link>
            </AccordionDetails>
          </Accordion>
        </AccordionGroup>
      </Stack>
    </Stack>
  )
}

export default Municipalities
