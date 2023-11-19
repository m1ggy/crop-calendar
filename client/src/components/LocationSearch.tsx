import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  FormLabel,
} from "@mui/joy";
import { useEffect, useMemo, useState } from "react";

type AnyFunction = (...args: any[]) => void;

function debounce<T extends AnyFunction>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
type LocationSearchProps = {
  onChange: (value: google.maps.places.PlaceResult) => void;
  disabled?: boolean;
};

function LocationSearch({ onChange, disabled }: LocationSearchProps) {
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [result, setResult] = useState<
    { label: string; value: google.maps.places.QueryAutocompletePrediction }[]
  >([]);

  const placeService = useMemo(() => {
    if (window.google) {
      const map = new google.maps.Map(
        document.createElement("div") as HTMLElement
      );

      const service = new google.maps.places.PlacesService(map);

      return service;
    }
  }, []);

  const autocompleteService = useMemo(() => {
    return new google.maps.places.AutocompleteService();
  }, []);

  useEffect(() => {
    if (searchKeyword) {
      setLoading(true);
      const debounced = debounce(() => {
        autocompleteService.getQueryPredictions(
          { input: searchKeyword },
          (predictions) => {
            setLoading(false);
            if (predictions)
              setResult(
                predictions.map((p) => ({ value: p, label: p.description }))
              );
          }
        );
      }, 1000);

      debounced();
    }
  }, [searchKeyword]);

  return (
    <FormControl>
      <FormLabel>Location</FormLabel>
      <Autocomplete
        disabled={disabled}
        slotProps={{
          root: {
            sx: {
              width: "100%",
            },
          },
        }}
        onInputChange={(_, value) => {
          setSearchKeyword(value);
        }}
        inputValue={searchKeyword}
        startDecorator={loading ? <CircularProgress size="sm" /> : <Search />}
        placeholder="Type to search for location"
        options={result}
        isOptionEqualToValue={(option, value) =>
          option.value.description === value.label
        }
        onChange={(_, value) => {
          if (onChange && value && value.value.place_id) {
            setLoading(true);
            placeService?.getDetails(
              {
                placeId: value.value.place_id,
              },
              (result) => {
                setLoading(false);
                console.log("value", result);
                if (result) onChange(result);
              }
            );
          }
        }}
      />
    </FormControl>
  );
}

export default LocationSearch;
