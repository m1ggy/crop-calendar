import { extendTheme } from "@mui/joy";

declare module "@mui/joy/Typography" {
  interface TypographyPropsVariantOverrides {
    primary: true;
    secondary: true;
    contrast: true;
  }
}

declare module "@mui/joy/styles" {
  interface Palette {
    contrast: {
      primary: string;
    };
  }
}

const theme = extendTheme({
  components: {
    JoyTypography: {
      styleOverrides: {
        root: () => ({
          fontFamily: "Poppins",
          color: "white",
        }),
      },
    },
    JoyButton: {
      styleOverrides: {
        root: () => ({
          color: "white",
        }),
      },
    },
  },
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          50: "#e7f7eb",
          100: "#c4ebcf",
          200: "#9edeb0",
          300: "#73d290",
          400: "#50c878",
          500: "#24be60",
          600: "#19ae55",
          700: "#079b49",
          800: "#008a3e",
          900: "#006a2a",
          solidColor: "#50c878",
        },
        contrast: {
          primary: "#2d3943",
        },
      },
    },
  },
});

export default theme;
