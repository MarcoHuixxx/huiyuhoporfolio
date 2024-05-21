import React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"left"} ref={ref} {...props} />;
});

export default function FullScreenDialog({
  open,
  setOpen,
  children,
  fullScreen,
  direction = "left",
  closeIcon = false,
}) {
  const handleBackHandler = () => {
    setOpen(false);
  };

  console.log("closeIcon:", closeIcon);

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
        <IconButton
          onClick={handleBackHandler}
          className="backButton"
          sx={{
            ...(!closeIcon && { left: "18px" }), // if closeIcon is false, then left: "18px
            ...(closeIcon && { right: "18px" }),
          }}
        >
          {/* <img className="backButtonIcon" src={ArrowBackIosNewIcon} /> */}
          {closeIcon ? <CloseIcon /> : <ArrowBackIosNewIcon />}
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
