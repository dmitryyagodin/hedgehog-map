import { useDataContext } from "@client/context/useDataContext";
import { Box, CircularProgress } from "@mui/material";

interface SpinnerProps {
  active?: boolean;
}

const Spinner = ({ active = true }: SpinnerProps) => {
  const { isLoading } = useDataContext();

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.05)", // Semi-transparent backdrop
        color: "#00b2a0",
        zIndex: 9999, // Ensure the spinner appears above other content
        visibility: isLoading && active ? "visible" : "hidden", // Show or hide the spinner based on isLoading
      }}
    >
      <CircularProgress color="inherit" size={50} thickness={4} />
    </Box>
  );
};

export default Spinner;
