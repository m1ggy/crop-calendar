import { InfoOutlined, YardOutlined } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  IconButton,
  Sheet,
  Stack,
  Table,
  Tooltip,
  Typography,
} from '@mui/joy'
import moment from 'moment-timezone'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Calendar, { CalendarData } from '../components/Calendar'
import Header from '../components/Header'
import LocationSearch from '../components/LocationSearch'
import useAppStore from '../store/app'

function getFirstAndLastByFlag(arr: CalendarData[], flag: boolean) {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be a non-empty array')
  }

  let first = null
  let last = null

  if (arr.length === 0) return { first, last }
  for (const obj of arr) {
    if (obj?.isValid === flag) {
      if (first === null) {
        first = obj
      }
      last = obj
    }
  }

  return { first, last }
}

function getStageStartAndEnd(arr: CalendarData[], flag: boolean) {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be a non-empty array')
  }

  const result: Record<
    string,
    { first: CalendarData | null; last: CalendarData | null }
  > = {}

  arr.forEach((obj) => {
    const stage = obj.stage
    if (!stage) return
    if (!result[stage]) {
      result[stage] = { first: null, last: null }
    }

    if (obj.isValid === flag) {
      if (result[stage].first === null) {
        result[stage].first = obj
      }
      result[stage].last = obj
    }
  })

  return result
}

const CROPS = [
  {
    label: 'Corn (Zea mays)',
    details: {
      temperature: {
        max: 15,
        min: 35,
        scale: 'celsius',
      },
      precipitation: {
        max: 3.8,
        min: 2.5,
        scale: 'centimeters',
      },
      daysToHarvest: 63,
      stages: [
        {
          name: 'Planting',
          days: 14,
        },
        {
          name: 'Growing',
          days: 40,
        },
        {
          name: 'Harvesting',
          days: 9,
        },
      ],
    },
  },
  {
    label: 'Rice (Oryza sativa)',
    details: {
      temperature: {
        max: 35,
        min: 23,
        scale: 'celsius',
      },
      precipitation: {
        max: 30,
        min: 50,
        scale: 'centimeters',
      },
      daysToHarvest: 180,
      stages: [
        {
          name: 'Planting',
          days: 10,
        },
        {
          name: 'Growing',
          days: 160,
        },
        {
          name: 'Harvesting',
          days: 10,
        },
      ],
    },
  },
  {
    label: 'Banana (Musa spp.)',
    details: {
      temperature: {
        max: 30,
        min: 26,
        scale: 'celsius',
      },
      precipitation: {
        max: 0.25,
        min: 0.54,
        scale: 'centimeters',
      },
      daysToHarvest: 365,
      stages: [
        {
          name: 'Planting',
          days: 181,
        },
        {
          name: 'Growing',
          days: 180,
        },
        {
          name: 'Harvesting',
          days: 4,
        },
      ],
    },
  },
  {
    label: 'Carrots (Daucus carota)',
    details: {
      temperature: {
        max: 32,
        min: 24,
        scale: 'celsius',
      },
      precipitation: {
        max: 10,
        min: 5,
        scale: 'centimeters',
      },
      daysToHarvest: 70,
      stages: [
        {
          name: 'Planting',
          days: 1,
        },
        {
          name: 'Growing',
          days: 68,
        },
        {
          name: 'Harvesting',
          days: 1,
        },
      ],
    },
  },
]

type CROP_TYPE = (typeof CROPS)[number]
function CropCalendar() {
  const {
    location: storeLocation,
    setLocation: setStoreLocation,
    crop: storeCrop,
    setCrop: setStoreCrop,
    calendarData: storeCalendarData,
    setCalendarData: setStoreCalendarData,
    clear,
  } = useAppStore(useShallow((state) => ({ ...state })))
  const [location, setLocation] =
    useState<google.maps.places.PlaceResult | null>(null)
  const [locationConfirmed, setLocationConfirmed] = useState(false)
  const [crop, setCrop] = useState<CROP_TYPE | null>(null)
  const [cropConfirmed, setCropConfirmed] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<
    { date: string; temperature: number; precipitation: number }[] | null
  >(null)
  const [toDisplay, setToDisplay] = useState<CalendarData[]>([])
  const [pageDataHydrated, setPageDataHydrated] = useState(false)

  useEffect(() => {
    if (!pageDataHydrated) {
      if (storeLocation) {
        setLocation(storeLocation)
        setLocationConfirmed(true)
      }
      if (storeCrop) {
        setCrop(storeCrop)
        setCropConfirmed(true)
      }
      if (storeCalendarData.length)
        setToDisplay(
          storeCalendarData.map((x) => {
            const date = moment(x.date)
              .tz('Asia/Manila')
              .set('year', moment().year())

            return { ...x, momentDate: date }
          })
        )
      setPageDataHydrated(true)
    }
  }, [pageDataHydrated, storeLocation, storeCrop, storeCalendarData])
  const createCropCalendar = useCallback(async () => {
    try {
      if (!location || !location.geometry || !location.geometry.location)
        throw Error('No Location selected')
      setProcessing(true)
      const lat =
        typeof location?.geometry?.location.lat === 'function'
          ? location?.geometry?.location.lat()
          : location?.geometry?.location.lat
      const lng =
        typeof location.geometry.location.lng === 'function'
          ? location.geometry.location.lng()
          : location.geometry.location.lng
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/predict`,
        {
          body: JSON.stringify({
            crops: [crop],
            coords: {
              lat,
              lng,
            },
          }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const jsonresponse = await response.json()

      setResult(jsonresponse.rawData)

      if (jsonresponse.result && jsonresponse.result.length) {
        const parsed = jsonresponse.result.map((x: Record<string, string>) => {


          const date = moment(x.date)
            .tz('Asia/Manila')
            .set('year', moment().year())

          return { ...x, momentDate: date }
        })

        setStoreCalendarData(parsed)
        setToDisplay(parsed)
      }
    } finally {
      setProcessing(false)
    }
  }, [crop, location, setStoreCalendarData])

  const prediction = useMemo(() => {
    if (toDisplay && crop) {
      let isStartingPointFound = false
      let currentCount = 0
      const mapped: CalendarData[] = []
      for (let i = 0; i < toDisplay.length; i++) {
        const currentDay = toDisplay[i]

        if (isStartingPointFound) {
          if (currentCount < crop.details.daysToHarvest) {
            const newData = { ...currentDay, isValid: true }

            let currentStage: { name: string; days: number } | null = null
            for (let k = 0; k < crop.details.stages.length; k++) {
              const total = crop.details.stages
                .slice(0, k + 1)
                .reduce((prev, curr) => prev + curr.days, 0)

              if (total > i) {
                currentStage = crop.details.stages[k]
                break
              }
            }
            if (currentStage) {
              newData.stage = currentStage.name
            } else {
              newData.stage = 'Suitable'
            }
            mapped.push(newData)
            currentCount += 1
          } else mapped.push({ ...currentDay, isValid: false })
        } else {
          if (currentDay.temperature <= crop.details.temperature.max) {
            const newData = { ...currentDay, isValid: true }

            if (crop.details.stages.length) {
              const startingStage = crop.details.stages[0]
              newData.stage = startingStage.name
              newData.prediction = crop.label as string
            }
            mapped.push(newData)
            isStartingPointFound = true
            currentCount += 1
          } else {
            mapped.push({ ...currentDay, isValid: false })
          }
        }
      }
      return mapped
    }
    return []
  }, [toDisplay, crop])

  const { first, last } = useMemo(() => {
    return getFirstAndLastByFlag(prediction ?? [], true)
  }, [prediction])

  const summaryDetails = useMemo(
    () => getStageStartAndEnd(prediction ?? [], true),
    [prediction]
  )
  const summaryKeys = useMemo(
    () => Object.keys(summaryDetails),
    [summaryDetails]
  )
  const summaryValues = useMemo(
    () => Object.values(summaryDetails),
    [summaryDetails]
  )
  return (
    <Container maxWidth={'lg'}>
      <Header
        sx={{ width: '100%', zIndex: 100, background: 'white' }}
        isDetached
      />
      <Stack gap={2} alignItems={'center'} justifyContent={'center'} pb={5}>
        <Stack gap={2} width={'100%'}>
          <Box>
            <LocationSearch
              disabled={locationConfirmed}
              onChange={(value) => {
                setLocation(value)
                setStoreLocation(value)
              }}
            />
          </Box>
          {location ? (
            <Stack gap={1}>
              <Typography textColor={'common.black'}>
                Selected location is: <b>{location.name}</b>
              </Typography>
              {locationConfirmed ? null : (
                <Button
                  disabled={locationConfirmed}
                  onClick={() => setLocationConfirmed(true)}
                >
                  Confirm
                </Button>
              )}
            </Stack>
          ) : null}
          {locationConfirmed ? (
            <Stack>
              <FormControl>
                <FormLabel>Crop</FormLabel>
                <Autocomplete
                  startDecorator={<YardOutlined />}
                  disabled={cropConfirmed}
                  options={CROPS}
                  onChange={(_, value) => {
                    if (value) {
                      setCrop(value)
                      setStoreCrop(value)
                    }
                  }}
                />
              </FormControl>
            </Stack>
          ) : null}
          {crop ? (
            <Stack gap={1}>
              <Typography textColor={'common.black'}>
                Selected crop is: <b>{crop.label}</b>
              </Typography>
              {cropConfirmed ? null : (
                <Button onClick={() => setCropConfirmed(true)}>Confirm</Button>
              )}
            </Stack>
          ) : null}
          {cropConfirmed && locationConfirmed ? (
            <Button
              variant="solid"
              loading={processing}
              onClick={createCropCalendar}
              disabled={!!result}
            >
              Create Crop Calendar
            </Button>
          ) : null}

          {cropConfirmed && locationConfirmed ? (
            <Button
              variant="outlined"
              color="danger"
              onClick={() => {
                setCropConfirmed(false)
                setLocationConfirmed(false)
                setCrop(null)
                setLocation(null)
                setResult(null)
                setToDisplay([])
                clear()
              }}
            >
              <Typography textColor={'danger.400'}>Reset</Typography>
            </Button>
          ) : null}

          {prediction && prediction.length ? (
            <Stack gap={1}>
              <Stack direction={'row'} gap={1} alignItems={'center'}>
                <Typography level="title-lg" textColor={'common.black'}>
                  Results
                </Typography>
                <Tooltip
                  title={
                    <Box maxWidth={'sm'}>
                      <Typography textColor={'common.black'}>
                        The data used are based on the{' '}
                        <a
                          href="https://open-meteo.com/en/docs/historical-weather-api"
                          target="_blank"
                          style={{
                            textDecoration: 'none',
                            color: 'Highlight',
                          }}
                        >
                          OpenMateo Historical Weather API
                        </a>{' '}
                        from 2021 transformed using Decision Tree Algorithm
                        based on real life crop requirements
                      </Typography>
                    </Box>
                  }
                >
                  <IconButton variant="plain">
                    <InfoOutlined />
                  </IconButton>
                </Tooltip>
              </Stack>

              {first && last ? (
                <>
                  <Typography textColor={'common.black'}>
                    Based on the analysis the best span to grow{' '}
                    <b>{crop?.label}</b> will be{' '}
                    <b>{first?.momentDate.format('DD MMMM YYYY')}</b> to{' '}
                    <b>{last?.momentDate?.format?.('DD MMMM YYYY')}</b>
                  </Typography>
                  <br />

                  {summaryKeys.length ? (
                    <>
                      <b>Details</b>

                      <Sheet>
                        <Table>
                          <thead>
                            <tr>
                              <td style={{ fontWeight: 'bold' }}>Stage</td>
                              <td style={{ fontWeight: 'bold' }}>Start Date</td>
                              <td style={{ fontWeight: 'bold' }}>End Date</td>
                            </tr>
                          </thead>
                          <tbody>
                            {summaryKeys.map((k, ki) => (
                              <tr key={k}>
                                <td style={{ fontWeight: 'bold' }}>{k}</td>
                                <td>
                                  {summaryValues[ki]?.first?.momentDate?.format(
                                    'DD MMMM YYYY'
                                  )}
                                </td>
                                <td>
                                  {summaryValues[ki]?.last?.momentDate?.format(
                                    'DD MMMM YYYY'
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Sheet>
                    </>
                  ) : null}
                </>
              ) : null}

              <Typography textColor={'common.black'}>
                The crop <b>{crop?.label}</b> has a precipitation requirement
                of: <b>{crop?.details.precipitation.min} cm</b> to{' '}
                <b>{crop?.details.precipitation.max} cm </b> (Centimeters) and
                temperature requirement of{' '}
                <b>{crop?.details.temperature.max} °C</b> to{' '}
                <b>{crop?.details.temperature.min} °C</b> (Degree Celsius)
                <br />
                <br />
                This crop requires <b>{crop?.details.daysToHarvest}</b> days to
                grow and be ready for harvest.
                <br />
                <br />
              </Typography>
              <Calendar data={prediction} />
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Container>
  )
}

export default CropCalendar
