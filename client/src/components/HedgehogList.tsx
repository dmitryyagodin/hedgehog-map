import { useDataContext } from "../context/useDataContext";
import Spinner from "./Spinner";
import { Box, MenuItem, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function HedgeHogList() {
  const {
    setHedgehogs,
    hedgehogs,
    setSelectedHedgehog,
    ids,
    setIds,
    setIsLoading,
  } = useDataContext();

  const [spinnerActive, setSpinnerAcive] = useState(false);

  // Fetch all hedgehog's during startup
  useEffect(() => {
    setSpinnerAcive(true);
    const getAllHedgehogs = async () => {
      try {
        const res = await fetch("/api/v1/hedgehog");
        if (!res.ok) return;

        const data = await res.json();
        data.ids &&
          data.ids.length &&
          setIds([...new Set([...data.ids, ...(ids || [])])]);
      } catch (err) {
        console.error(`Error while fetching hedgehogs: ${err}`);
      } finally {
        setIsLoading(false);
        setSpinnerAcive(false);
      }
    };

    getAllHedgehogs();
  }, []);

  async function handleFetchById(id: number) {
    setSelectedHedgehog(id);

    /* no need to fetch if already in the state */
    if (hedgehogs?.find((h) => h.id === id)) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/v1/hedgehog/${id}`);
      if (!res.ok) return;
      const json = await res.json();
      setHedgehogs([json.hedgehog]);
    } catch (err) {
      console.error(`Error while fetching hedgehogs: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Paper elevation={3} sx={{ margin: "1em", overflow: "hidden" }}>
      <Box
        sx={{
          backgroundColor: "#a1e6df",
          height: "3em",
          display: "flex",
          zIndex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "darkslategrey" }}>
          Rekisteröidyt siilit
        </Typography>
      </Box>
      <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
        <Spinner active={spinnerActive} />
        {ids && ids.length && (
          <Box sx={{ overflowY: "scroll" }}>
            {ids.map((item, index) => (
              <MenuItem
                key={`hedgehog-index-${item.id}`}
                onClick={() => handleFetchById(item.id)}
              >
                #{index + 1} {item.name}
              </MenuItem>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
