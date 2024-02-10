import { ThemeProvider as TailwindThemeProvider } from "@material-tailwind/react";
import React from "react";

const theme = {};

export default function ThemeProvider({ children }) {
  return (
    <TailwindThemeProvider value={theme}>
      {children}
    </TailwindThemeProvider>
  );
}