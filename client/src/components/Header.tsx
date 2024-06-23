import { Box, Button, Typography } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

type HeaderProps = {
  sx?: SxProps
}
function Header({ sx }: HeaderProps) {
  const navigate = useNavigate()

  const scrollIntoView = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }, [])
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: '5rem',
        py: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100%',
        backgroundColor: 'rgba(250,250,250,0.20)',
        ...sx,
      }}
    >
      <Box>
        <Typography
          level="h2"
          textColor={'black'}
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          Smart Crop
        </Typography>
      </Box>
      <Box>
      <Button variant="plain" onClick={() => scrollIntoView('what')}>
        <Typography textColor={'black'}>What?</Typography>
      </Button>
      <Button variant="plain" onClick={() => scrollIntoView('features')}>
        <Typography textColor={'black'}>Features</Typography>
      </Button>
      <Button variant="plain" onClick={() => navigate('/crops')}>
        <Typography textColor={'black'}>Crops</Typography>
      </Button>
      <Button onClick={() => scrollIntoView('generate')} sx={(theme) => ({ backgroundColor: theme.palette.primary[100] })}>
        <Typography textColor={'black'}>Generate</Typography>
      </Button>
      </Box>
    </Box>
  )
}

export default Header
