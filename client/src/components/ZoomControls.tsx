import { IconReset } from "./icons";
import { Box, Button } from "@mui/material";

/* TODO REFACTOR STYLING */
const ZoomControls = ({ ...props }) => {
  return (
    <Box
      className="zoom-controls"
      style={{
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        columnGap: "6px",
      }}
    >
      <Button
        onClick={props.onZoomIn}
        variant="contained"
        color="primary"
        size="medium"
      >
        +
      </Button>
      <Button
        onClick={props.onResetView}
        variant="contained"
        color="primary"
        size="medium"
      >
        <IconReset fill="#fff" />
      </Button>
      <Button
        onClick={props.onZoomOut}
        variant="contained"
        color="primary"
        size="medium"
      >
        -
      </Button>
    </Box>
  );
};

export default ZoomControls;
