import { StateCreator } from 'zustand'
import { CalendarData } from '../components/Calendar'

export type Note = {
  title: string
  content: string
}
export type Crop = {
  label: string
  details: {
    temperature: {
      max: number
      min: number
      scale: string
    }
    precipitation: {
      max: number
      min: number
      scale: string
    }
    daysToHarvest: number
    stages: {
      name: string
      days: number
    }[]
  }
}
export type CalendarSlice = {
  location: google.maps.places.PlaceResult | null
  setLocation: (location: google.maps.places.PlaceResult) => void
  crop: Crop | null
  setCrop: (crop: Crop) => void
  calendarData: CalendarData[]
  setCalendarData: (calendarData: CalendarData[]) => void
  clear: () => void
  notes: Note[]
  addNote: (note: Note) => void
  setNote: (note: Note) => void
}

export const calendarSlice: StateCreator<
  CalendarSlice,
  [],
  [],
  CalendarSlice
> = (set, get) => ({
  location: null,
  setLocation: (location) => set({ location }),
  crop: null,
  setCrop: (crop) => set({ crop }),
  calendarData: [],
  setCalendarData: (calendarData) => set({ calendarData }),
  clear: () => set({ location: null, crop: null, calendarData: [], notes: [] }),
  notes: [],
  addNote: (note) => {
    const { notes } = get()

    set({ notes: [...notes, note] })
  },
  setNote: (note) => set({ notes: [...get().notes, note] }),
})
