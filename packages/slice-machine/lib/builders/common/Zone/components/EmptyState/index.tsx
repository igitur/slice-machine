import { Box, Button, Text, Heading } from 'theme-ui'
import { FaPlus } from 'react-icons/fa'

const ZoneEmptyState = ({ onEnterSelectMode }: { onEnterSelectMode: Function }) => (
  <Box sx={{ textAlign: 'center', my: 4 }}>
    <Heading as="h5">Add a new field here</Heading>
    <Box sx={{ my: 2 }}>
      <Text sx={{ color: 'textClear' }}>Add a field to your static zone</Text>
    </Box>
    <Button mt={3} variant="buttons.darkSmall" onClick={() => onEnterSelectMode()}>
      <FaPlus style={{ position: 'relative', top: '2px' }} /> Add a new field
    </Button>
  </Box>
)

export default ZoneEmptyState
