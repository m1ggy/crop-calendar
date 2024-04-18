import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calendarSlice, type CalendarSlice } from './calendar'

const useAppStore = create<CalendarSlice>()(
  persist((...a) => ({ ...calendarSlice(...a) }), {
    name: 'Crop Calendar',
    partialize: (state) => ({
      location: state.location,
      crop: state.crop,
      calendarData: state.calendarData,
      notes: state.notes,
    }),
  })
)

export default useAppStore
