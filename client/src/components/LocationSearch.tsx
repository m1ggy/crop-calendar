import { Search } from '@mui/icons-material'
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  FormLabel,
} from '@mui/joy'
import { throttle } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'

type LocationSearchProps = {
  onChange: (value: google.maps.places.PlaceResult) => void
  disabled?: boolean
}

function LocationSearch({ onChange, disabled }: LocationSearchProps) {
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [intervalId, setIntervalId] = useState<number>(NaN)
  const [result, setResult] = useState<
    { label: string; value: google.maps.places.QueryAutocompletePrediction }[]
  >([])

  const placeService = useMemo(() => {
    if (window.google) {
      const map = new google.maps.Map(
        document.createElement('div') as HTMLElement
      )

      const service = new google.maps.places.PlacesService(map)

      return service
    }
  }, [])

  const autocompleteService = useMemo(() => {
    return new google.maps.places.AutocompleteService()
  }, [])

  const searchCallback = useCallback(
    (value: string) => {
      setSearchKeyword(value)
      setLoading(true)
      const timeoutId = setTimeout(() => {
        if (value.length)
          autocompleteService.getQueryPredictions(
            { input: value },
            (predictions) => {
              setLoading(false)
              if (predictions)
                setResult(
                  predictions.map((p) => ({
                    value: p,
                    label: p.description,
                  }))
                )
            }
          )
      }, 1000)

      setIntervalId(timeoutId as unknown as number)
    },
    [autocompleteService]
  )

  return (
    <FormControl>
      <FormLabel>Location</FormLabel>
      <Autocomplete
        disabled={disabled}
        slotProps={{
          root: {
            sx: {
              width: '100%',
            },
          },
        }}
        onInputChange={(_, value) => {
          throttle(() => searchCallback(value), 500, { trailing: true })()
        }}
        onKeyDown={() => clearInterval(intervalId)}
        inputValue={searchKeyword}
        startDecorator={loading ? <CircularProgress size="sm" /> : <Search />}
        placeholder="Type to search for location"
        options={result}
        isOptionEqualToValue={(option, value) =>
          option.value.description === value.label
        }
        onChange={(_, value) => {
          if (onChange && value && value.value.place_id) {
            setLoading(true)
            placeService?.getDetails(
              {
                placeId: value.value.place_id,
              },
              (result) => {
                setLoading(false)
                if (result) onChange(result)
              }
            )
          }
        }}
      />
    </FormControl>
  )
}

export default LocationSearch
