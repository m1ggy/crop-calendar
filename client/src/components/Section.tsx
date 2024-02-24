import { Box } from "@mui/joy";

import { PropsWithChildren } from "react";

interface SectionProps extends PropsWithChildren {
  sx?: Record<string, string | number>;
  id?: string;
}
function Section({ children, sx, id }: SectionProps) {
  return (
    <Box py={10} minHeight={"86vh"} sx={sx ? sx : null} id={id}>
      {children}
    </Box>
  );
}

export default Section;
