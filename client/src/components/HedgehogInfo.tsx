import { useDataContext } from "../context/useDataContext";
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
import { useEffect, useState } from "react";

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
  } = useDataContext();

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
      setIds([...(ids ? ids.filter((item) => id !== item.id) : [])]);
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
      <Paper elevation={3} sx={{ margin: "1em", padding: "1em" }}>
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
                <LabelValuePair label="Nimi" value={currentHedgehog.name} />
                <LabelValuePair label="Ikä" value={currentHedgehog.age} />
                <LabelValuePair
                  label="Sukupuoli"
                  value={currentHedgehog.gender}
                />
                <LabelValuePair
                  label="Lisätty"
                  value={
                    (currentHedgehog.date &&
                      formatDate(currentHedgehog.date)) ||
                    ""
                  }
                />
                <LabelValuePair label="Lev." value={coords.latitude} />
                <LabelValuePair label="Pit." value={coords.longitude} />
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

const LabelValuePair = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <>
    <span>
      <strong>{label}</strong>
    </span>
    <span>{value}</span>
  </>
);
