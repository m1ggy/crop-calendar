import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from '@mui/joy'
import { useCallback, useEffect, useState } from 'react'
import CropForm, { FormData } from '../components/CropForm'
import addCrop from '../db/addCrop'
import deleteCrop from '../db/deleteCrop'
import editCrop from '../db/editCrop'
import getCrops from '../db/getCrops'
import { Crop } from '../util/types'

function ManageCrops({ municipality }: { municipality: string }) {
  const [crops, setCrops] = useState<Crop[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [defaultValues, setDefaultValues] = useState<Crop | null>(null)
  const get = useCallback(async () => {
    const result = (await getCrops(municipality)) as Crop[]
    setCrops(result)
  }, [municipality])
  useEffect(() => {
    get()
  }, [municipality, get])

  const onAdd = async (data: FormData) => {
    console.log({ data })
    try {
      setLoading(true)
      await addCrop(data, municipality)
      await get()
    } catch (error) {
      console.log('Error: ', error)
    } finally {
      setLoading(false)
      setModalOpen(false)
    }
  }

  const onEdit = async (data: FormData) => {
    console.log({ data })

    try {
      setLoading(true)
      await editCrop(defaultValues?.id as string, data, municipality)
      await get()
    } catch (error) {
      console.log('Error: ', error)
    } finally {
      setLoading(false)
      setModalOpen(false)
    }
  }

  const onDelete = async (id: string) => {
    try {
      setLoading(true)
      await deleteCrop(id)
      await get()
    } catch (error) {
      console.log('Error: ', error)
    } finally {
      setLoading(false)
      setModalOpen(false)
    }
  }

  return (
    <Stack
      sx={{
        gap: '5px',
        justifyContent: 'center',
        px: 5,
      }}
    >
      <Box
        sx={{ display: 'flex', gap: '5px', justifyContent: 'space-between' }}
      >
        <Typography textColor={'common.black'} level="h4">
          Manage Crops
        </Typography>
        <Button
          onClick={() => {
            setDefaultValues(null)
            setModalOpen(true)
          }}
        >
          Add new Crop
        </Button>
      </Box>
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {crops.map((c) => (
            <Card key={c.id} sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography textColor={'common.black'} level="title-lg">
                  {c.label}
                </Typography>
                <Typography textColor={'common.black'} fontSize={'xs'}>
                  {c.featured ? 'Featured Crop 🥇' : ''}
                </Typography>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <Button
                    loading={loading}
                    onClick={() => {
                      setDefaultValues(c)
                      setModalOpen(true)
                    }}
                  >
                    Edit Crop
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => onDelete(c.id as string)}
                    loading={loading}
                  >
                    Delete Crop
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {!crops.length ? (
            <>
              <Typography textColor={'common.black'}>No Crops. </Typography>
            </>
          ) : null}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalDialog sx={{ width: '70vw' }}>
          <ModalClose />
          <Typography textColor={'common.black'} level="h4">
            {defaultValues ? 'Edit' : 'Add'} Crop
          </Typography>
          <CropForm
            onSubmit={defaultValues ? onEdit : onAdd}
            loading={loading}
            defaultValues={defaultValues}
          />
        </ModalDialog>
      </Modal>
    </Stack>
  )
}

export default ManageCrops
