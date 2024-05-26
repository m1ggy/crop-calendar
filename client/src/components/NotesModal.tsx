import { Close } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Typography } from '@mui/joy'
import Notes from './Notes'
interface NotesModalProps {
  date: string
  onClose: () => void
}
function NotesModal({ date, onClose }: NotesModalProps) {
  return (
    <Card>
      <CardContent sx={{ p: 5, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <Typography textColor={'common.black'} level="h2">
            Notes
          </Typography>
          <Button variant="plain" onClick={onClose} size="lg">
            <Close sx={{ color: 'black' }} />
          </Button>
        </Box>
        <Notes date={date} />
      </CardContent>
    </Card>
  )
}

export default NotesModal
