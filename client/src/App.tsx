import { HedgehogForm } from "./components/HedgehogForm";
import { HedgehogInfo } from "./components/HedgehogInfo";
import HedgeHogList from "./components/HedgehogList";
import { Map } from "./components/Map";
import { DataContextProvider } from "./context/useDataContext";
import { Box, Paper, Typography } from "@mui/material";

export function App() {
  return (
    <DataContextProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: { md: "100vh" },
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#00B2A0",
            height: "40px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "white" }} variant="overline">
            Siilit kartalla
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "grid",
            gridAutoColumns: { xs: "1fr", md: "1fr 1.5fr 2fr" },
            gridAutoFlow: { xs: "row", md: "column" },
            overflow: { md: "hidden" },
          }}
        >
          <HedgeHogList />
          <Box>
            <HedgehogInfo />
            <HedgehogForm />
          </Box>
          <Paper
            elevation={3}
            sx={{ margin: "1em", minHeight: { xs: "50vh", md: "initial" } }}
          >
            <Map />
          </Paper>
        </Box>
        <Box
          sx={{
            backgroundColor: "#00B2A0",
            height: "40px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "white" }} variant="overline">
            Powered by Ubigu Oy
          </Typography>
        </Box>
      </Box>
    </DataContextProvider>
  );
}
