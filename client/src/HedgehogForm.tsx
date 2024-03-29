import { DataContext } from "./context/dataContext";
import { transformCoordinates } from "./lib/transformCoordinates";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { hedgehogSchema } from "@ubigu/shared/src/hedgehog";
import { useContext, useState } from "react";

export function HedgehogForm() {
  const { coordinates, setIds } = useContext(DataContext);
  const [errors, setErrors] = useState<{
    name?: string;
    age?: string;
    gender?: string;
  }>({});

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
          const id: number | null = data?.id;

          if (id !== null && id !== undefined) {
            // setIds((prevIds) => Array.isArray(prevIds) ? [...prevIds, id] : id);
          }
        } catch (err) {
          console.error(`Error while adding a new hedgehog: ${err}`);
        }
      };

      postHedgehog();
    }
  };

  if (coordinates && coordinates.length) {
    const { latitude, longitude } = transformCoordinates(coordinates);

    return (
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" rowGap={2}>
          <TextField
            label="Nimi"
            name="name"
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Ikä (1-20)"
            name="age"
            variant="outlined"
            type="number"
            error={!!errors.age}
            helperText={errors.age}
            fullWidth
            placeholder="1-20"
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
            >
              <MenuItem value="unknown" selected>
                Tunematon
              </MenuItem>
              <MenuItem value="male">Koiras</MenuItem>
              <MenuItem value="female">Naaras</MenuItem>
            </Select>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Lisää
        </Button>
      </form>
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
