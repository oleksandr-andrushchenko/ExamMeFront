import { ThemeProvider as MaterialTailwindThemeProvider } from "@material-tailwind/react";
import React from "react";

const theme = {};

export default function ThemeProvider({ children }) {
  return (
    <MaterialTailwindThemeProvider value={theme}>
      {children}
    </MaterialTailwindThemeProvider>
  );
}