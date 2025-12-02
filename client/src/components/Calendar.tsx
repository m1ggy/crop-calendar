import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import StickyNote2Icon from '@mui/icons-material/StickyNote2'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import {
  Button,
  Divider,
  Grid,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from '@mui/joy'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import useAppStore from '../store/app'
import generateMonthArray from '../util/generateMonth'
import NotesModal from './NotesModal'
import ProcedureModal from './ProcedureModal'
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
  const { notes } = useAppStore(useShallow((state) => ({ notes: state.notes })))
  const [openNotes, setOpenNotes] = useState(false)
  const [noteDate, setNoteDate] = useState('')
  const [openDescription, setOpenDescription] = useState(false)
  const [description, setDescription] = useState('')
  const [crop, setCrop] = useState('')
  const currentMonth = useMemo(() => moment().month(), [])
  const currentYear = useMemo(() => moment().year(), [])
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)

  console.log({ crop })

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
          console.log({ match })
          const hasNotes = Boolean(
            notes.find(
              (z) => moment(z.date).format('MM-DD') === x?.format('MM-DD')
            )
          )
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
                        <Button
                          onClick={() => {
                            setOpenNotes(true)
                            setNoteDate(match.date)
                          }}
                        >
                          <Typography textColor={'common.white'}>
                            View Notes
                          </Typography>
                        </Button>
                        <Button
                          disabled={
                            match.stage == null || match.stage.length == 0
                          }
                          onClick={() => {
                            setOpenDescription(true)
                            setDescription(match.stage ?? '')
                            setCrop(match.prediction)
                          }}
                        >
                          <Typography textColor={'common.white'}>
                            View Procedure
                          </Typography>
                        </Button>
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

                    {hasNotes ? (
                      <StickyNote2Icon sx={{ color: '#FFEB3B' }} />
                    ) : null}
                  </Stack>
                </Stack>
              </Tooltip>
            </Grid>
          )
        })}
      </Grid>
      <Modal
        open={openNotes}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <NotesModal date={noteDate} onClose={() => setOpenNotes(false)} />
      </Modal>
      <Modal
        open={openDescription}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ProcedureModal
          title={description}
          onClose={() => setOpenDescription(false)}
          crop={crop}
        />
      </Modal>
    </Stack>
  )
}

export default Calendar
