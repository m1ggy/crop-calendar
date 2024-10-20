import {
  Box,
  Button,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from '@mui/joy'
import { ParsedToken } from 'firebase/auth'
import { capitalize } from 'lodash-es'
import { useEffect, useState } from 'react'
import { getUserCustomClaims, logOutUser } from '../auth/auth'
import ManageCrops from './ManageCrops'

function Admin() {
  const [claims, setClaims] = useState<ParsedToken | null>(null)

  useEffect(() => {
    getUserCustomClaims().then((c) => setClaims(c))
  }, [])
  return (
    <Stack
      sx={{
        width: '100vw',
        height: '100vh',
        px: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '50px',
          justifyContent: 'flex-end',
          py: 2,
          px: 3,
        }}
      >
        <Typography textColor={'common.black'}>
          Hello{' '}
          {(claims && (claims?.Municipality as string)) ?? 'Crop Calendar'}{' '}
          admin!
        </Typography>
        <Button variant="plain" sx={{ color: 'black' }} onClick={logOutUser}>
          Logout
        </Button>
      </Box>
      <Typography level="h2" textColor={'common.black'}>
        {capitalize(claims?.Municipality as string)} Dashboard
      </Typography>
      <Tabs orientation="vertical">
        <TabList>
          <Tab variant="plain" color="neutral">
            Crops
          </Tab>
        </TabList>
        <TabPanel value={0}>
          <ManageCrops municipality={claims?.Municipality as string} />
        </TabPanel>
      </Tabs>
    </Stack>
  )
}

export default Admin
