import { DataContext } from "../context/dataContext";
import { formatDate } from "../lib/formatDate";
import { DeleteIcon } from "./icons";
import { transformCoordinates } from "@client/lib/transformCoordinates";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useContext, useState } from "react";

export function HedgehogInfo() {
  const {
    selectedHedgehog,
    hedgehogs,
    setHedgehogs,
    setSelectedHedgehog,
    ids,
    setIds,
  } = useContext(DataContext);
  const [openModal, setOpenModal] = useState(false);

  if (!selectedHedgehog) {
    return (
      <Paper
        elevation={3}
        sx={{
          margin: "1em 0em 1em 0em",
          padding: "1em",
        }}
      >
        <Typography>
          Valitse siili listalta tai lisää uusi lomakkeella
        </Typography>
      </Paper>
    );
  }

  const currentHedgehog =
    hedgehogs?.find((h) => h.id === selectedHedgehog) || null;

  if (!currentHedgehog) return <></>;

  const { latitude, longitude } = transformCoordinates(
    currentHedgehog?.coordinates
  );

  function handleClick() {
    setOpenModal(true);
  }

  async function handleConfirmDelete() {
    const id = currentHedgehog?.id;
    try {
      const res = await fetch(`/api/v1/hedgehog/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error(`Failed to delete hedgehog with ID ${id}`);
        return;
      }

      // Remove the deleted hedgehog from the local state
      hedgehogs && setHedgehogs([...hedgehogs.filter((h) => h.id !== id)]);
      setSelectedHedgehog(null);
      setIds([...(ids?.filter((item) => id !== item) || [])]);
    } catch (err) {
      console.error(`Error while deleting hedgehog with ID ${id}: ${err}`);
    } finally {
      setOpenModal(false);
    }
  }

  function handleCancelDelete() {
    setOpenModal(false);
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          margin: "1em 0em 1em 0em",
          padding: "1em",
        }}
      >
        {currentHedgehog && (
          <>
            <Typography
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <span>
                <strong>Nimi</strong>
              </span>
              <span>{currentHedgehog.name}</span>
              <span>
                <strong>Ikä</strong>
              </span>
              <span>{currentHedgehog.age}</span>
              <span>
                <strong>Sukupuoli</strong>
              </span>
              <span> {currentHedgehog.gender}</span>
              <span>
                <strong>Lisätty</strong>
              </span>
              <span>
                {currentHedgehog.date && formatDate(currentHedgehog.date)}
              </span>
              <span>
                <strong>Lev.</strong>
              </span>
              <span>{latitude}</span>
              <span>
                <strong>Pit.</strong>
              </span>
              <span> {longitude}</span>
            </Typography>
            <Box
              sx={{
                paddingTop: "0.8rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button onClick={handleClick} variant="contained" color="warning">
                <DeleteIcon />
              </Button>
            </Box>
          </>
        )}
      </Paper>
      <Dialog open={openModal} onClose={handleCancelDelete}>
        <DialogTitle>Varmista poisto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Haluatko varmasti poistaa tämän siilin?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Peruuta
          </Button>
          <Button onClick={handleConfirmDelete} color="warning" autoFocus>
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
