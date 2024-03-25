import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/joy'
import { capitalize } from 'lodash-es'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Markdown from '../components/Markdown'

type AccordionEntry = { title: string; detail: string }
const CROP_LIST = ['corn', 'banana', 'carrot', 'rice']
function Info() {
  const [entries, setEntries] = useState<AccordionEntry[]>([])

  useEffect(() => {
    CROP_LIST.forEach((crop) => {
      fetch(`/crops/${crop}.md`)
        .then((response) => response.text())
        .then((text) => {
          setEntries((prev) => {
            const capitalizedCropName = capitalize(crop)
            if (!prev.find((v) => v.title === capitalizedCropName))
              return [...prev, { title: capitalizedCropName, detail: text }]
            return prev
          })
        })
    })
  }, [entries])
  return (
    <>
      <Header />
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Stack gap={2}>
          <Typography level="h2" textColor={'primary.400'}>
            Crops
          </Typography>
          <Typography textColor={'common.black'}>
            Here you can find the list of crops available in the crop calendar.
            You can view the different stages of the crop as well as helpful
            topics in growing your crops.
          </Typography>
          <AccordionGroup size="lg">
            {entries.map((info, index) => {
              return (
                <Accordion key={index}>
                  <AccordionSummary>{info.title}</AccordionSummary>
                  <AccordionDetails>
                    <Box maxWidth={'lg'}>
                      <Markdown>{info.detail}</Markdown>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </AccordionGroup>
        </Stack>
      </Box>
    </>
  )
}

export default Info
