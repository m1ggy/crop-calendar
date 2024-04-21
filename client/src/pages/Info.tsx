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
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Markdown from '../components/Markdown'

type AccordionEntry = { title: string; detail: string }
const CROP_LIST = ['corn', 'banana', 'carrot', 'rice']
function Info() {
  const container = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [entries, setEntries] = useState<AccordionEntry[]>([])
  const [searchParams] = useSearchParams()
  const [forceExpand, setForceExpand] = useState<{
    crop: string
    stage: string
  }>({ crop: '', stage: '' })
  useEffect(() => {
    const cropType = searchParams.get('crop')
    const stage = searchParams.get('stage')

    if (cropType) setForceExpand({ crop: cropType, stage: stage || '' })
  }, [searchParams, navigate])

  useEffect(() => {
    if (forceExpand.stage) {
      const element = document.getElementById(forceExpand.stage.toLowerCase())
      console.log({ element })
      element?.scroll({ behavior: 'smooth' })
    }
  }, [forceExpand])

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
      <Header sx={{ width: '100%' }} />
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
          <AccordionGroup size="lg" ref={container}>
            {entries.map((info, index) => {
              const expanded =
                info.title.toLowerCase() === forceExpand.crop.toLowerCase()
              return (
                <Accordion key={index} defaultExpanded={expanded}>
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
