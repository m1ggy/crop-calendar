import { Box, Button, Typography } from '@mui/joy'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

function StickyNav() {
  const scrollIntoView = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }, [])
  const navigate = useNavigate()

  return (
    <Box
      display={'flex'}
      gap={2}
      justifyContent={'flex-end'}
      position={'sticky'}
      top={0}
      px={5}
      py={1}
      sx={{ backgroundColor: 'rgba(250,250,250,0.2)' }}
>
      <Button variant="plain" onClick={() => scrollIntoView('what')}>
        <Typography textColor={'black'}>What?</Typography>
      </Button>
      <Button variant="plain" onClick={() => scrollIntoView('features')}>
        <Typography textColor={'black'}>Features</Typography>
      </Button>
      <Button variant="plain" onClick={() => navigate('/crops')}>
        <Typography textColor={'black'}>Crops</Typography>
      </Button>
      <Button onClick={() => scrollIntoView('generate')} sx={{ backgroundColor: 'white' }}>
        <Typography textColor={'black'}>Generate</Typography>
      </Button>
    </Box>
  )
}

export default StickyNav
