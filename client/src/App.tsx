import { HedgehogForm } from "./components/HedgehogForm";
import { HedgehogInfo } from "./components/HedgehogInfo";
import HedgeHogList from "./components/HedgehogList";
import { Map } from "./components/Map";
import Spinner from "./components/Spinner";
import { ContextProvider } from "./context/dataContext";
import { Box, Paper, Typography } from "@mui/material";

export function App() {
  return (
    <ContextProvider>
      <Spinner />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
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
            gridAutoColumns: "1fr 1.5fr 2fr",
            gridAutoFlow: "column",
            overflow: "hidden",
          }}
        >
          <HedgeHogList />
          <Box>
            <HedgehogInfo />
            <HedgehogForm />
          </Box>
          <Paper elevation={3} sx={{ margin: "1em" }}>
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
          {" "}
          <Typography sx={{ color: "white" }} variant="overline">
            Powered by Ubigu Oy
          </Typography>
        </Box>
      </Box>
    </ContextProvider>
  );
}
