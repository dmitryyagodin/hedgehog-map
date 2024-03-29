import { HedgehogForm } from "./HedgehogForm";
import { HedgehogInfo } from "./HedgehogInfo";
import HedgeHogList from "./HedgehogList";
import { Map } from "./Map";
import { Box, Paper, Typography } from "@mui/material";
import { ContextProvider } from "./context/dataContext";

export function App() {

  return (

    <ContextProvider>
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
