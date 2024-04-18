import { Box, Typography } from '@mui/joy'
import { SxProps } from '@mui/joy/styles/types'
import { useNavigate } from 'react-router-dom'

type HeaderProps = {
  sx?: SxProps
}
function Header({ sx }: HeaderProps) {
  const navigate = useNavigate()
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
        width: 'fit-content',
        backgroundColor: 'white',
        ...sx,
      }}
    >
      <Box>
        <Typography
          level="h2"
          textColor={'primary.400'}
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          Smart Crop
        </Typography>
      </Box>
    </Box>
  )
}

export default Header
