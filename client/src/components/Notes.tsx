import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardContent,
  Divider,
  Input,
  Stack,
  Typography,
} from '@mui/joy'
import moment from 'moment'
import { useCallback, useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'
import useAppStore from '../store/app'
import sendEmail from '../util/sendEmail'
const noteSchema = z
  .object({
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(5000),
    date: z.string().optional(),
  })
  .required()

type NoteSchema = z.infer<typeof noteSchema>

interface NotesProps {
  date: string
}
function Notes({ date }: NotesProps) {
  const { notes, addNote } = useAppStore(
    useShallow((state) => ({ notes: state.notes, addNote: state.addNote }))
  )
  const currentDate = moment(date)
  const dateNotes = useMemo(() => {
    return notes.filter((note) => moment(note.date).isSame(currentDate, 'day'))
  }, [currentDate, notes])

  const form = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      date: currentDate.toString(),
    },
  })

  const onSubmit: SubmitHandler<NoteSchema> = useCallback(
    (data) => {
      addNote({ ...data })
      sendEmail({
        to: 'rebson.pontipedra@lspu.edu.ph',
        subject: `New Comment from Crop Calendar user!`,
        html:
          'Hi there! a new comment was added by a user: \n' +
          `
          <br/>
        <b>${data.title}</b>

        <p>${data.content}</p>
        `,
      })
      form.reset()
    },
    [addNote, form]
  )
  return (
    <Stack width={'40vw'}>
      <Stack py={5} gap={2} maxHeight={'50vh'} overflow={'auto'}>
        {dateNotes.map((note, i) => (
          <Card key={note.title}>
            <CardContent>
              <Stack>
                <Typography textColor={'common.black'} level="h4">
                  {(i + 1).toString().padStart(2, '0').padEnd(3, '.')}{' '}
                  {note.title}
                </Typography>
                <br />
                <Typography textColor={'common.black'}>
                  {note.content}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {!dateNotes.length ? (
          <Typography textColor={'common.black'} textAlign={'center'}>
            No notes yet.
          </Typography>
        ) : null}
      </Stack>
      <Divider />
      <Stack
        component={'form'}
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log({ error })
        })}
        gap={2}
      >
        <Typography textColor={'common.black'} level="h4">
          New Note
        </Typography>
        <Controller
          control={form.control}
          name="title"
          render={({ field }) => (
            <Stack>
              <Typography textColor={'common.black'}>Title:</Typography>
              <Input type="string" {...field} />
            </Stack>
          )}
        />
        <Controller
          control={form.control}
          name="content"
          render={({ field }) => (
            <Stack>
              <Typography textColor={'common.black'}>Content:</Typography>
              <textarea style={{ resize: 'none' }} {...field} />
            </Stack>
          )}
        />
        <Button type="submit">Create Note</Button>
      </Stack>
    </Stack>
  )
}

export default Notes
