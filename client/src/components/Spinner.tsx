import { DataContext } from "@client/context/dataContext";
import { Box, CircularProgress } from "@mui/material";
import { useContext } from "react";

const Spinner = () => {
  const { isLoading } = useContext(DataContext);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent backdrop
        color: "#00b2a0",
        zIndex: 9999, // Ensure the spinner appears above other content
        visibility: isLoading ? "visible" : "hidden", // Show or hide the spinner based on isLoading
      }}
    >
      <CircularProgress color="inherit" size={50} thickness={4} />
    </Box>
  );
};

export default Spinner;
