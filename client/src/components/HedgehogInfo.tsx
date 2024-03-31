import { DataContext } from "../context/dataContext";
import { formatDate } from "../lib/formatDate";
import Spinner from "./Spinner";
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
import { useContext, useEffect, useState } from "react";

export function HedgehogInfo() {
  const {
    selectedHedgehog,
    hedgehogs,
    setHedgehogs,
    setSelectedHedgehog,
    ids,
    setIds,
    setIsLoading,
    isLoading,
  } = useContext(DataContext);

  const [openModal, setOpenModal] = useState(false);
  const [spinnerActive, setSpinnerActive] = useState(false);

  useEffect(() => {
    if (selectedHedgehog) {
      setSpinnerActive(true);
    } else {
      setSpinnerActive(false);
    }
  }, [selectedHedgehog]);

  async function handleDelete() {
    const id = selectedHedgehog;
    setIsLoading(true);
    setSpinnerActive(true);
    try {
      const res = await fetch(`/api/v1/hedgehog/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error(`Failed to delete hedgehog with ID ${id}`);
        return;
      }

      // Remove the deleted hedgehog from the local state
      hedgehogs && setHedgehogs(hedgehogs.filter((h) => h.id !== id));
      setSelectedHedgehog(null);
      setIds([...(ids ? ids.filter((item) => id !== item) : [])]);
    } catch (err) {
      console.error(`Error while deleting hedgehog with ID ${id}: ${err}`);
    } finally {
      setSpinnerActive(false);
      setIsLoading(false);
      setOpenModal(false);
    }
  }

  function handleCancelDelete() {
    setOpenModal(false);
  }

  function handleConfirmDelete() {
    setOpenModal(true);
  }

  const currentHedgehog = hedgehogs
    ? hedgehogs.find((h) => h.id === selectedHedgehog)
    : null;
  const coords = currentHedgehog
    ? transformCoordinates(currentHedgehog.coordinates)
    : null;

  return (
    <>
      <Paper elevation={3} sx={{ margin: "1em 0em 1em 0em", padding: "1em" }}>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            minHeight: "300px",
            position: "relative",
          }}
        >
          <Spinner active={!!selectedHedgehog && spinnerActive} />
          {currentHedgehog && coords ? (
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
                <span>{currentHedgehog.gender}</span>
                <span>
                  <strong>Lisätty</strong>
                </span>
                <span>
                  {currentHedgehog.date && formatDate(currentHedgehog.date)}
                </span>
                <span>
                  <strong>Lev.</strong>
                </span>
                <span>{coords.latitude}</span>
                <span>
                  <strong>Pit.</strong>
                </span>
                <span>{coords.longitude}</span>
              </Typography>
              <Box
                sx={{
                  paddingTop: "0.8rem",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={handleConfirmDelete}
                  variant="contained"
                  color="warning"
                >
                  <DeleteIcon fill="currentColor" />
                </Button>
              </Box>
            </>
          ) : (
            <Typography sx={{ display: isLoading ? "none" : "block" }}>
              Valitse siili listalta tai lisää uusi lomakkeella
            </Typography>
          )}
        </Box>
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
          <Button onClick={handleDelete} color="warning" autoFocus>
            Vahvista
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
