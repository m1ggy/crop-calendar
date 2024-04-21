import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import { Button, Divider, Grid, Stack, Tooltip, Typography } from '@mui/joy'
import moment from 'moment'
import { useMemo, useState } from 'react'
import generateMonthArray from '../util/generateMonth'
export type CalendarData = {
  date: string
  prediction: string
  temperature: number
  precipitation: number
  momentDate: moment.Moment
  isValid?: boolean
  stage?: string
}
type CalendarProps = {
  data: CalendarData[]
}
function Calendar({ data }: CalendarProps) {
  console.log({ data })
  const currentMonth = useMemo(() => moment().month(), [])
  const currentYear = useMemo(() => moment().year(), [])
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)

  const calendar = useMemo(() => {
    return generateMonthArray(selectedMonth, currentYear)
  }, [selectedMonth, currentYear])
  return (
    <Stack gap={2} width={'100%'}>
      <Stack
        direction="row"
        gap={2}
        alignItems={'center'}
        justifyContent={'center'}
        width={'100%'}
      >
        <Button
          disabled={selectedMonth === 0}
          onClick={() => setSelectedMonth((prev) => prev - 1)}
        >
          Prev Month
        </Button>
        <Typography level="title-md" textColor={'common.black'}>
          {moment(selectedMonth + 1, ['M']).format('MMMM')}
        </Typography>
        <Button
          disabled={selectedMonth === 11}
          onClick={() => setSelectedMonth((prev) => prev + 1)}
        >
          Next Month
        </Button>
      </Stack>
      <Grid container columns={7} width={'100%'}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((x) => (
          <Grid
            xs={1}
            sx={{
              height: '2rem',
              textAlign: 'center',
            }}
          >
            <Typography textColor={'common.black'}>{x}</Typography>
          </Grid>
        ))}
        {calendar.map((x, i) => {
          const match = data.find((v) => v.momentDate.isSame(x, 'day'))
          return (
            <Grid
              key={i}
              xs={1}
              sx={{
                height: '10rem',
                border: moment.isMoment(x) ? '1px solid gray' : '',
                p: 1,
              }}
            >
              <Tooltip
                placement="top"
                variant="outlined"
                arrow
                title={
                  match ? (
                    <Stack sx={{ color: 'black', p: 2, gap: 2 }}>
                      <Typography textColor={'common.black'}>
                        {match?.prediction}
                      </Typography>
                      <Divider />
                      <Stack gap={1}>
                        {match.stage ? (
                          <Typography
                            textColor={'common.black'}
                            fontSize={'sm'}
                            startDecorator={<EventAvailableIcon />}
                          >
                            <b>{match.stage}</b>
                          </Typography>
                        ) : null}
                        <Typography
                          textColor={'common.black'}
                          startDecorator={<DeviceThermostatIcon />}
                        >
                          {match.temperature.toFixed(2)} °C
                        </Typography>
                        <Typography
                          textColor={'common.black'}
                          startDecorator={<WaterDropIcon />}
                        >
                          {match.precipitation.toFixed(2)} cm
                        </Typography>
                        <a
                          href={`/crops?crop=${
                            match.prediction.split(' ')[0]
                          }&stage=${match.stage}`}
                        >
                          <Typography textColor={'common.black'}>
                            See more details
                          </Typography>
                        </a>
                      </Stack>
                    </Stack>
                  ) : null
                }
              >
                <Stack gap={1} justifyContent={'center'} alignItems={'center'}>
                  <Typography textColor={'common.black'} level="title-md">
                    {x?.format('DD')}
                  </Typography>
                  <Stack
                    gap={1}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    {match ? (
                      <>
                        <Typography
                          level="body-sm"
                          textColor={'common.black'}
                          startDecorator={<DeviceThermostatIcon />}
                        >
                          {match.temperature.toFixed(2)} °C
                        </Typography>
                        <Typography
                          level="body-sm"
                          textColor={'common.black'}
                          startDecorator={<WaterDropIcon />}
                        >
                          {match.precipitation.toFixed(2)} cm
                        </Typography>
                        {match.isValid ? (
                          <Typography
                            textColor={'primary.400'}
                            fontWeight={'bold'}
                            fontSize={'sm'}
                            sx={{ textAlign: 'center' }}
                          >
                            {match.stage}
                          </Typography>
                        ) : null}
                      </>
                    ) : null}
                  </Stack>
                </Stack>
              </Tooltip>
            </Grid>
          )
        })}
      </Grid>
      ;
    </Stack>
  )
}

export default Calendar
