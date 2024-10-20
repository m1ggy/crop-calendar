import {
  Box,
  Button,
  Checkbox,
  Option,
  Select,
  Stack,
  Typography,
} from '@mui/joy'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  BoldItalicUnderlineToggles,
  headingsPlugin,
  MDXEditor,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { YardOutlined } from '@mui/icons-material'
import { noop } from 'lodash-es'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Crop, CROPS, Details } from '../util/types'

const schema = z.object({
  label: z.string().min(1),
  featured: z.boolean().default(false),
  details: z.object({
    temperature: z
      .object({
        max: z.number().min(1),
        min: z.number().min(1),
        scale: z.string().default('celsius'),
      })
      .required(),
    precipitation: z
      .object({
        max: z.number(),
        min: z.number(),
        scale: z.string().default('mm'),
      })
      .required(),
    daysToHarvest: z.number().min(1),
    stages: z
      .array(
        z.object({
          name: z.string().min(1),
          days: z.number().min(1),
        })
      )
      .min(1),
  }),
  content: z.string().min(1),
})
export type FormData = z.infer<typeof schema>

type CropFormProps = {
  onSubmit: (data: FormData) => void
  defaultValues?: Crop | null
  loading?: boolean
}

function CropForm({
  onSubmit = noop,
  defaultValues = null,
  loading,
}: CropFormProps) {
  console.log({ onSubmit })
  const {
    handleSubmit,
    setValue,
    watch,
    getValues,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  })

  // Watch the current value of the content field
  const contentValue = watch('content') ?? ''

  // Handle content change in MDXEditor and update form state
  const handleContentChange = (content: string) => {
    setValue('content', content) // Update the content field in React Hook Form
  }

  const labelValue = watch('label')
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit, (err) => console.log({ err }))}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: '60vw',
        margin: 'auto',
        overflow: 'auto',
      }}
    >
      <Stack gap={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Checkbox
            {...register('featured')}
            defaultChecked={getValues('featured')}
          />
          <Typography textColor={'common.black'} fontWeight={'500'}>
            Featured?
          </Typography>
          {errors.featured && (
            <Typography color="danger">{errors.featured.message}</Typography>
          )}
        </Box>
        <Typography textColor={'common.black'} fontWeight={'600'}>
          Crop
        </Typography>
        <Stack>
          <Select
            startDecorator={<YardOutlined />}
            value={labelValue}
            onChange={(_, value) => {
              console.log({ value })
              const selectedValue = value
              const selectedCrop = CROPS.find(
                (crop) => crop.label === selectedValue
              )
              console.log({ selectedCrop })
              if (selectedCrop) {
                setValue('label', selectedCrop.label as string)
                setValue('details', selectedCrop.details as Details)
              }
            }}
          >
            {CROPS.map((crop) => (
              <Option key={crop.label} value={crop.label}>
                {crop.label}
              </Option>
            ))}
          </Select>
        </Stack>
      </Stack>

      <Typography textColor={'common.black'} fontWeight={'600'}>
        Content (Markdown supported)
      </Typography>
      <MDXEditor
        markdown={contentValue}
        onChange={handleContentChange}
        plugins={[
          headingsPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                {' '}
                <UndoRedo />
                <BoldItalicUnderlineToggles />
              </>
            ),
          }),
        ]}
      />

      {/* Submit Button */}
      <Button type="submit" variant="solid" color="primary" loading={loading}>
        Submit
      </Button>
    </Box>
  )
}

export default CropForm
