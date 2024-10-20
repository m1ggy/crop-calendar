import { Box, Button, Typography } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

type HeaderProps = {
  sx?: SxProps
  isDetached?: boolean
}
function Header({ sx, isDetached }: HeaderProps) {
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
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="plain"
          onClick={() =>
            isDetached ? navigate('/#what') : scrollIntoView('what')
          }
        >
          <Typography textColor={'black'}>What?</Typography>
        </Button>
        <Button
          variant="plain"
          onClick={() =>
            isDetached ? navigate('/#features') : scrollIntoView('features')
          }
        >
          <Typography textColor={'black'}>Features</Typography>
        </Button>
        <Button
          variant="plain"
          onClick={() => (isDetached ? navigate('/crops') : navigate('/crops'))}
        >
          <Typography textColor={'black'}>Crops</Typography>
        </Button>
        <Button variant="plain" onClick={() => navigate('/municipalities')}>
          <Typography textColor={'black'}>Municipalities</Typography>
        </Button>
        <Button variant="plain" onClick={() => navigate('/login')}>
          <Typography textColor={'black'}>Login</Typography>
        </Button>
        <Button
          onClick={() =>
            isDetached ? navigate('/#generate') : scrollIntoView('generate')
          }
          sx={(theme) => ({ backgroundColor: theme.palette.primary[100] })}
        >
          <Typography textColor={'black'}>Generate</Typography>
        </Button>
      </Box>
    </Box>
  )
}

export default Header
