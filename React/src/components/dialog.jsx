import React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  open,
  setOpen,
  children,
  fullScreen,
}) {
  const handleBackHandler = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          height: "100%",
          //   "& .MuiDialog-paper": { width: "80%", maxHeight: 435 },
        }}
        aria-describedby="alert-dialog-slide-description"
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
