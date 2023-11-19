import { Button, Grid, Stack, Typography } from "@mui/joy";
import moment from "moment";
import { useMemo, useState } from "react";
import generateMonthArray from "../util/generateMonth";

export type CalendarData = {
  date: string;
  prediction: string;
  temperature: number;
  precipitation: number;
  momentDate: moment.Moment;
};
type CalendarProps = {
  data: CalendarData[];
};
function Calendar({ data }: CalendarProps) {
  const currentMonth = useMemo(() => moment().month(), [moment]);
  const currentYear = useMemo(() => moment().year(), [moment]);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);

  const calendar = useMemo(() => {
    return generateMonthArray(selectedMonth, currentYear);
  }, [selectedMonth, currentYear]);

  console.log({ calendar, selectedMonth });
  return (
    <Stack gap={2} width={"100%"}>
      <Stack
        direction="row"
        gap={2}
        alignItems={"center"}
        justifyContent={"center"}
        width={"100%"}
      >
        <Button
          disabled={selectedMonth === 0}
          onClick={() => setSelectedMonth((prev) => prev - 1)}
        >
          Prev Month
        </Button>
        <Typography level="title-md">
          {moment(selectedMonth + 1, ["M"]).format("MMMM")}
        </Typography>
        <Button
          disabled={selectedMonth === 11}
          onClick={() => setSelectedMonth((prev) => prev + 1)}
        >
          Next Month
        </Button>
      </Stack>
      <Grid container columns={7} width={"100%"}>
        {["M", "T", "W", "T", "F", "S", "S"].map((x) => (
          <Grid
            xs={1}
            sx={{
              height: "2rem",
              textAlign: "center",
            }}
          >
            <Typography>{x}</Typography>
          </Grid>
        ))}
        {calendar.map((x, i) => {
          const match = data.find((v) => v.momentDate.isSame(x, "day"));
          return (
            <Grid
              key={i}
              xs={1}
              sx={{
                height: "8rem",
                border: moment.isMoment(x) ? "1px solid gray" : "",
              }}
            >
              <Typography level="title-md">{x?.format("DD")}</Typography>
              {match ? (
                <>
                  <Typography textAlign={"center"} level="title-sm">
                    {match.prediction}
                  </Typography>
                  <Typography level="body-sm">
                    Temp: {match.temperature.toFixed(2)} °C
                  </Typography>
                  <Typography level="body-sm">
                    Precipitation: {match.precipitation.toFixed(2)} cm
                  </Typography>
                </>
              ) : null}
            </Grid>
          );
        })}
      </Grid>
      ;
    </Stack>
  );
}

export default Calendar;
