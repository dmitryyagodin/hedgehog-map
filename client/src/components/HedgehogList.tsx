import { DataContext } from "../context/dataContext";
import { Box, MenuItem, Paper, Typography } from "@mui/material";
import { useEffect, useContext } from "react";

export default function HedgeHogList() {
  const {
    setHedgehogs,
    hedgehogs,
    setSelectedHedgehog,
    ids,
    setIds,
    setIsLoading,
  } = useContext(DataContext);

  // Fetch all hedgehog's during startup
  useEffect(() => {
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
      {ids && ids.length ? (
        <Box sx={{ overflowY: "scroll", height: "100%" }}>
          {ids.map((id) => (
            <MenuItem
              key={`hedgehog-index-${id}`}
              onClick={() => handleFetchById(id)}
            >
              #{id}
            </MenuItem>
          ))}
        </Box>
      ) : (
        <Typography sx={{ padding: "1em" }}>
          TODO: Mikäli tietokannasta löytyy siilejä, ne listautuvat tähän.
          Koodaa logiikka, jolla tämän listauksen siiliä klikkaamalla siili
          tulee valituksi, jonka jälkeen sen tiedot tulee hakea viereiseen
          komponenttiin.
        </Typography>
      )}
    </Paper>
  );
}
