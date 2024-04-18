import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardContent, Input, Stack, Typography } from '@mui/joy'
import { useCallback } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'
import useAppStore from '../store/app'
const noteSchema = z
  .object({
    title: z.string().min(1).max(255),
    content: z.string().min(1).max(5000),
  })
  .required()

type NoteSchema = z.infer<typeof noteSchema>
function Notes() {
  const { notes, addNote } = useAppStore(
    useShallow((state) => ({ notes: state.notes, addNote: state.addNote }))
  )

  const form = useForm<NoteSchema>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const onSubmit: SubmitHandler<NoteSchema> = useCallback(
    (data) => {
      console.log({ data })
      addNote(data)
      form.reset()
    },
    [addNote, form]
  )
  return (
    <Stack minHeight={'500px'} pb={10}>
      <Typography textColor={'common.black'} level="h2">
        Notes
      </Typography>
      <Stack py={5} gap={2}>
        {notes.map((note, i) => (
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
        {!notes.length ? (
          <Typography textColor={'common.black'}>No Notes</Typography>
        ) : null}
      </Stack>

      <Stack
        component={'form'}
        onSubmit={form.handleSubmit(onSubmit, (error) =>
          console.log({ error })
        )}
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
