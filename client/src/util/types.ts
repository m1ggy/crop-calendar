type Stage = {
  name: string
  days: number
}

type Temperature = {
  max: number
  min: number
  scale: string
}

type Precipitation = {
  max: number
  min: number
  scale: string
}

export type Details = {
  temperature: Temperature
  precipitation: Precipitation
  daysToHarvest: number
  stages: Stage[]
}

export type Crop = {
  label: string
  details: Details
  featured: boolean
  id?: string
  content?: string
}

export const CROPS = [
  {
    label: 'Corn',
    details: {
      temperature: {
        max: 15,
        min: 35,
        scale: 'celsius',
      },
      precipitation: {
        max: 3.8,
        min: 2.5,
        scale: 'centimeters',
      },
      daysToHarvest: 63,
      stages: [
        {
          name: 'Planting',
          days: 14,
        },
        {
          name: 'Growing',
          days: 40,
        },
        {
          name: 'Harvesting',
          days: 9,
        },
      ],
    },
  },
  {
    label: 'Rice',
    details: {
      temperature: {
        max: 35,
        min: 23,
        scale: 'celsius',
      },
      precipitation: {
        max: 30,
        min: 50,
        scale: 'centimeters',
      },
      daysToHarvest: 180,
      stages: [
        {
          name: 'Planting',
          days: 10,
        },
        {
          name: 'Growing',
          days: 160,
        },
        {
          name: 'Harvesting',
          days: 10,
        },
      ],
    },
  },
  {
    label: 'Banana',
    details: {
      temperature: {
        max: 30,
        min: 26,
        scale: 'celsius',
      },
      precipitation: {
        max: 0.25,
        min: 0.54,
        scale: 'centimeters',
      },
      daysToHarvest: 365,
      stages: [
        {
          name: 'Planting',
          days: 181,
        },
        {
          name: 'Growing',
          days: 180,
        },
        {
          name: 'Harvesting',
          days: 4,
        },
      ],
    },
  },
  {
    label: 'Carrot',
    details: {
      temperature: {
        max: 32,
        min: 24,
        scale: 'celsius',
      },
      precipitation: {
        max: 10,
        min: 5,
        scale: 'centimeters',
      },
      daysToHarvest: 70,
      stages: [
        {
          name: 'Planting',
          days: 1,
        },
        {
          name: 'Growing',
          days: 68,
        },
        {
          name: 'Harvesting',
          days: 1,
        },
      ],
    },
  },
]
