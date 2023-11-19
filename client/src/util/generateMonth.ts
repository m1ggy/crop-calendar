import moment from "moment";

function generateMonthArray(
  month: number,
  year: number
): (moment.Moment | null)[] {
  const startOfMonth = moment([year, month]); // month is zero-based in Moment.js
  const firstDayOfMonth = startOfMonth.clone().startOf("month");
  const firstMonday = firstDayOfMonth.clone().day(1); // Find the first Monday
  const endOfMonth = startOfMonth.clone().endOf("month");
  let currentDay = firstMonday.clone();
  const monthArray: (moment.Moment | null)[] = [];

  // Add padding for incomplete week at the beginning
  while (currentDay.isBefore(firstDayOfMonth, "day")) {
    monthArray.push(null); // Use null or another value to represent the missing days
    currentDay.add(1, "day");
  }

  // Add days of the month
  while (currentDay.isSameOrBefore(endOfMonth, "day")) {
    monthArray.push(currentDay.clone());
    currentDay.add(1, "day");
  }

  return monthArray;
}

export default generateMonthArray;
