import { Close } from '@mui/icons-material'
import { Box, Button, Card, Typography } from '@mui/joy'
import { useMemo } from 'react'
import Markdown from './Markdown'

type CROP_NAMES =
  | 'Corn (Zea mays)'
  | 'Rice (Oryza sativa)'
  | 'Banana (Musa spp.)'
  | 'Carrots (Daucus carota)'
interface ProcedureModalProps {
  onClose?: () => void
  title: string
  crop: CROP_NAMES
}
function ProcedureModal({ onClose, title, crop }: ProcedureModalProps) {
  console.log({ crop })

  const content = useMemo(() => {
    switch (crop) {
      case 'Banana (Musa spp.)': {
        switch (title) {
          case 'Planting': {
            return `
## Planting

1. **Selecting a Site:**

   - Choose a location with well-drained soil, ample sunlight, and protection from strong winds.

2. **Preparing the Soil:**

   - Ensure the soil is rich in organic matter and has a pH between 5.5 and 7.0.
   - Dig a hole twice as wide and deep as the root ball.

3. **Planting the Banana Plant:**
   - Place the banana plant in the hole and backfill with soil, ensuring the plant sits at the same level as it was in the nursery pot.
   - Water thoroughly after planting.`
          }
          case 'Growing': {
            return `
## Growing

1. **Watering:**

   - Keep the soil consistently moist but not waterlogged. Bananas require regular watering, especially during dry periods.

2. **Fertilizing:**

   - Apply a balanced fertilizer containing nitrogen, phosphorus, and potassium every 2-3 months during the growing season.

3. **Mulching:**

   - Apply a layer of organic mulch, such as straw or compost, around the base of the banana plant to retain moisture and suppress weeds.

4. **Pruning:**

   - Remove dead or damaged leaves regularly to encourage healthy growth.

5. **Protection from Pests and Diseases:**
   - Monitor for pests like banana aphids and diseases such as Panama disease.
   - Use appropriate pesticides or organic controls as needed.`
          }
          case 'Harvesting': {
            return `            
## Harvesting

- **Timing:** Bananas typically take 3-6 months to ripen after flowering, depending on the variety.
- **Method:** Harvest bananas when they are fully yellow and firm, with a slight green tip. Cut the entire bunch from the plant and hang it to ripen further.
`
          }
        }
        break
      }
      case 'Carrots (Daucus carota)': {
        switch (title) {
          case 'Planting': {
            return `
## Planting

1. **Choose Your Variety:**

   - Early varieties: Sow in spring, ready to harvest in 10 weeks.
   - Late varieties: Sow from late spring, ready in 14-16 weeks.

2. **Prepare Soil:**

   - Fork thoroughly, remove stones. Light, well-drained soil is best.

3. **Direct Sowing:**

   - Make a shallow trench (1cm deep).
   - Sow seeds thinly (5-8cm apart).
   - Cover with sieved soil and water well.

4. **Successive Sowing:**
   - Sow seeds every two weeks for extended cropping.`
          }
          case 'Growing': {
            return `
## Growing

1. **Container Planting:**

   - Choose a container with minimum 30cm depth.
   - Fill with sifted garden soil or loam-based compost.
   - Sow seeds thinly, cover lightly with soil.

2. **Care:**

   - Water regularly, especially in dry weather.
   - Prevent carrot root fly by covering with fleece.
   - Harvest by watering compost first to soften soil.

3. **Maintenance:**
   - Keep soil weed-free.
   - Water occasionally to encourage deep root growth.
   - Avoid full sun exposure during peak heat.`
          }
          case 'Harvesting': {
            return `
## Harvesting

- **Timing:** Lift carrots when soil is moist to prevent breakage.
- **Method:** Gently pull carrots from the soil, water to settle remaining roots.`
          }
        }
        break
      }
      case 'Corn (Zea mays)': {
        switch (title) {
          case 'Planting': {
            return `
## Planting

1. **Choose Planting Time:**

   - Plant corn when soil temperatures reach 60°F (15.5°C) or higher.

2. **Soil Preparation:**

   - Choose a sunny location with well-drained soil.
   - Loosen soil to a depth of 8-10 inches (20-25cm) and remove weeds.

3. **Sowing Seeds:**

   - Plant corn seeds 1-2 inches (2.5-5cm) deep and 9-12 inches (23-30cm) apart.
   - Plant in blocks instead of single rows to ensure good pollination.

4. **Watering:**

   - Keep soil consistently moist but not waterlogged, especially during the first few weeks after planting.

5. **Fertilizing:**
   - Apply a balanced fertilizer when planting and side-dress with nitrogen when corn plants are knee-high.`
          }
          case 'Growing': {
            return `
## Growing

1. **Maintenance:**

   - Keep the area around corn plants weed-free to reduce competition for nutrients and water.
   - Hill soil around the base of the plants when they are about 12 inches (30cm) tall to support root development.

2. **Pollination:**

   - Corn plants have both male (tassels) and female (silks) flowers. Wind pollinates the corn by carrying pollen from tassels to silks.

3. **Pest and Disease Control:**
   - Monitor for pests such as corn earworm and control them with appropriate measures.
   - Watch for diseases like corn smut and treat as necessary.`
          }
          case 'Harvesting': {
            return `     
## Harvesting

- **Timing:** Harvest corn when kernels are plump and produce a milky liquid when pierced with a fingernail.
- **Method:** To harvest, twist ears downward and pull them from the stalk.`
          }
        }
        break
      }
      case 'Rice (Oryza sativa)': {
        switch (title) {
          case 'Planting': {
            return `
## Planting

1. **Choose Planting Time:**

   - Plant rice when soil temperatures are consistently above 70°F (21°C).

2. **Soil Preparation:**

   - Choose a sunny location with fertile, clayey soil that can hold water.
   - Level the field and prepare the soil by plowing and harrowing.

3. **Seed Preparation:**

   - Soak rice seeds in water for 24-48 hours before planting to encourage germination.

4. **Transplanting (for paddy rice):**

   - Transplant seedlings into flooded fields when they are 25-35 days old.

5. **Direct Seeding (for upland rice):**

   - Broadcast rice seeds onto prepared soil and cover lightly with soil.

6. **Water Management:**
   - Maintain flooded conditions in paddy fields throughout the growing season.
   - Keep upland fields moist but not waterlogged.`
          }
          case 'Growing': {
            return `
## Growing

1. **Fertilization:**
            
    - Apply organic or chemical fertilizers based on soil test results and rice growth stage.
            
2. **Weed Control:**
            
    - Regularly remove weeds by hand or use herbicides as necessary.
            
3. **Pest and Disease Management:**
            
    - Monitor for pests such as rice blast and insects like rice stem borers.
    - Apply appropriate pesticides or biological control measures.
            
4. **Rice Growth Stages:**
    - Rice typically goes through stages such as germination, tillering, flowering, grain filling, and maturity.`
          }
          case 'Harvesting': {
            return `
## Harvesting

- **Timing:** Harvest rice when grains have turned golden yellow and have a moisture content of about 20%.
- **Method:** Cut rice stalks close to the ground and thresh to separate grains from the straw.`
          }
        }
        break
      }
      default:
        ''
    }
  }, [crop, title])
  return (
    <Card sx={{ width: '40vw', p: 5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <Typography textColor={'common.black'} level="h2">
          Procedure
        </Typography>
        <Button variant="plain" onClick={onClose} size="lg">
          <Close sx={{ color: 'black' }} />
        </Button>
      </Box>
      <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
        <Markdown>{content}</Markdown>
      </Box>
    </Card>
  )
}

export default ProcedureModal
