import { DataContext } from "../context/dataContext";
import { formatDate } from "../lib/formatDate";
import { Paper, Typography } from "@mui/material";
import { useContext } from "react";

export function HedgehogInfo() {
  const { selectedHedgehog, hedgehogs } = useContext(DataContext);
  const currentHedgehog =
    hedgehogs?.find((h) => h.id === selectedHedgehog) || null;

  return (
    <Paper
      elevation={3}
      sx={{
        margin: "1em 0em 1em 0em",
        padding: "1em",
      }}
    >
      {currentHedgehog && (
        <Typography>
          Nimi: {currentHedgehog.name}
          <br />
          Ikä: {currentHedgehog.age}
          <br />
          Sukupuoli: {currentHedgehog.gender}
          <br />
          Lisätty: {currentHedgehog.date && formatDate(currentHedgehog.date)}
        </Typography>
      )}
    </Paper>
  );
}
