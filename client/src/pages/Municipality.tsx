import { Button, Card, CardContent, Stack, Typography } from '@mui/joy'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Markdown from '../components/Markdown'
import getCrops from '../db/getCrops'
import { Crop } from '../util/types'

function Municipality() {
  const navigate = useNavigate()
  const params = useParams()
  const municipality = params.municipality as string
  const [crops, setCrops] = useState<Crop[]>([])
  const get = useCallback(async () => {
    const result = (await getCrops(municipality)) as Crop[]
    setCrops(result)
  }, [municipality])

  useEffect(() => {
    get()
  }, [get])

  const featured = crops.filter((crop) => crop.featured)
  const normal = crops.filter((crop) => !crop.featured)
  return (
    <Stack>
      <Header
        isDetached
        sx={{ backgroundColor: 'white', opacity: 1, zIndex: 1000 }}
      />
      <Stack sx={{ px: 10, gap: 2, pb: 10 }}>
        <Typography level="h1" textColor={'common.black'}>
          {params.municipality?.charAt(0).toLocaleUpperCase()}
          {params.municipality?.substring(1)}
        </Typography>
        <Typography level="h4" textColor={'common.black'}>
          Featured Crops{' '}
        </Typography>
        <Stack gap={2}>
          {featured.map((crop) => (
            <Card>
              <CardContent>
                <Stack gap={1}>
                  <Typography level="title-lg" textColor={'common.black'}>
                    {crop.label}
                  </Typography>
                  <Markdown>{crop.content}</Markdown>
                  <Typography level="title-md" textColor={'common.black'}>
                    Stages
                  </Typography>
                  {crop.details.stages.map((stage) => (
                    <Typography textColor={'common.black'}>
                      {stage.name}: {stage.days} days
                    </Typography>
                  ))}

                  <Button
                    onClick={() =>
                      navigate(`/crops?crop=${crop.label.toLowerCase()}`)
                    }
                  >
                    View Crop Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {!featured.length ? (
            <Typography textColor={'common.black'} textAlign={'center'}>
              No Crops
            </Typography>
          ) : null}
        </Stack>
        <Typography level="h4" textColor={'common.black'}>
          Other Crops{' '}
        </Typography>
        <Stack>
          {normal.map((crop) => (
            <Card>
              <CardContent>
                <Stack gap={1}>
                  <Typography level="title-lg" textColor={'common.black'}>
                    {crop.label}
                  </Typography>
                  <Markdown>{crop.content}</Markdown>
                  <Typography level="title-md" textColor={'common.black'}>
                    Stages
                  </Typography>
                  {crop.details.stages.map((stage) => (
                    <Typography textColor={'common.black'}>
                      {stage.name}: {stage.days} days
                    </Typography>
                  ))}

                  <Button
                    onClick={() =>
                      navigate(`/crops?crop=${crop.label.toLowerCase()}`)
                    }
                  >
                    View Crop Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {!normal.length ? (
            <Typography textColor={'common.black'} textAlign={'center'}>
              No Crops
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Municipality
