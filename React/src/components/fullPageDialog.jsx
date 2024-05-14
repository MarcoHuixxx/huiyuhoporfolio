import React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function FullScreenDialog({ open, setOpen, children, locale }) {
  const handleBackHandler = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
        sx={{
          height: "100%",
        }}
        // className={Styles.dialog}
      >
        <IconButton onClick={handleBackHandler} className="backButton">
          {/* <img className="backButtonIcon" src={ArrowBackIosNewIcon} /> */}
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box className="dialogContainer">{children}</Box>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
