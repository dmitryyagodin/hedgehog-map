import { useDataContext } from "../context/useDataContext";
import { transformCoordinates } from "../lib/transformCoordinates";
import Spinner from "./Spinner";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { hedgehogSchema } from "@ubigu/shared/src/hedgehog";
import { useState } from "react";

export function HedgehogForm() {
  const { coordinates, setIds, setIsLoading, ids, setSelectedHedgehog } =
    useDataContext();
  const [errors, setErrors] = useState<{
    name?: string;
    age?: string;
    gender?: string;
  }>({});

  const [spinnerActive, setSpinnerAcive] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const name = formData.get("name") as string;
    const age = Number(formData.get("age"));
    const gender = formData.get("gender") as string;

    const validation = hedgehogSchema.safeParse({
      name,
      age,
      gender,
      coordinates,
    });

    if ("error" in validation) {
      const validationErrors: { [key: string]: string } = {};
      validation.error.errors.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
      setErrors(validationErrors);
    } else if (validation.success && validation.data) {
      setSelectedHedgehog(null);
      setIsLoading(true);
      setSpinnerAcive(true);

      const postHedgehog = async () => {
        try {
          const res = await fetch("/api/v1/hedgehog", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(validation.data),
          });

          if (!res.ok) return;

          const data = await res.json();
          const id = {
            id: data.id,
            name: name,
          };

          setIds([...(ids || []), id]);
        } catch (err) {
          console.error(`Error while adding a new hedgehog: ${err}`);
        } finally {
          setIsLoading(false);
          setSpinnerAcive(false);
        }
      };

      postHedgehog();
    }
  };

  function checkCustomValidity(event: React.FocusEvent<HTMLInputElement>) {
    const target = event.target.name;
    const inputValue = event.target.value;

    const validation = hedgehogSchema.safeParse({
      [target]:
        event.target.type === "number" ? Number(inputValue) : inputValue,
    });

    if ("error" in validation) {
      const validationErrors: { [key: string]: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0] === event.target.name) {
          validationErrors[err.path[0]] = err.message;
        }
      });
      setErrors(validationErrors);
    }
  }

  if (coordinates && coordinates.length) {
    const { latitude, longitude } = transformCoordinates(coordinates);

    return (
      <Box
        sx={{
          maxWidth: "300px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <Spinner active={spinnerActive} />
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" rowGap={2}>
            <TextField
              label="Nimi"
              name="name"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              onBlur={checkCustomValidity}
            />
            <TextField
              label="Ikä (1-20)"
              name="age"
              variant="outlined"
              type="number"
              error={!!errors.age}
              helperText={errors.age}
              fullWidth
              onBlur={checkCustomValidity}
            />
            <FormControl variant="outlined" error={!!errors.gender} fullWidth>
              <InputLabel id="gender-label">Sukupuoli</InputLabel>
              <Select
                labelId="gender-label"
                label="Sukupuoli"
                name="gender"
                variant="outlined"
                error={!!errors.gender}
                defaultValue=""
                onBlur={checkCustomValidity}
              >
                <MenuItem value="unknown" selected>
                  unknown
                </MenuItem>
                <MenuItem value="male">Koiras</MenuItem>
                <MenuItem value="female">Naaras</MenuItem>
              </Select>
              {errors.gender && (
                <FormHelperText>{errors.gender}</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="Lat."
              variant="outlined"
              value={latitude}
              disabled
              fullWidth
            />
            <TextField
              label="Long."
              variant="outlined"
              value={longitude}
              disabled
              fullWidth
            />
          </Box>
          <Button
            sx={{ marginTop: "16px" }}
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Lisää
          </Button>
        </form>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        margin: "1em 0em 1em 0em",
        padding: "1em",
      }}
    >
      <Typography>
        Rekisteröi uusi siili valitsemalla sijainti kartalta
      </Typography>
    </Paper>
  );
}
