import React from "react";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import icmaIcon from "../assets/icma.svg";
import youtubeIcon from "../assets/youtube.svg";
import facebookIcon from "../assets/fb.svg";
import igIcon from "../assets/ig.svg";
import icmaHomeMobileIcon from "../assets/icmaMobile.svg";
import icmaHomeWebIcon from "../assets/icmaHome.svg";
import icmaVotePageIcon from "../assets/icmaWeb.svg";

import "./styles/footer.css";

const Footer = ({ type, isMd }) => {
  const IconButtonStack = () => {
    return (
      <Stack
        direction="row"
        spacing={isMd ? 10 : 5}
        sx={{
          height: "100px",
          alignItems: "center",
          ...(type === "home" ? { marginTop: isMd ? "0" : "-110px" } : {}),
          //   width: "100%",
        }}
      >
        <IconButton
          size="small"
          onClick={() =>
            window.open("https://www.youtube.com/@icma.", "_blank")
          }
        >
          <img
            src={youtubeIcon}
            alt="youtube"
            className={isMd ? "socialIconWeb" : "socialIconMobile"}
          />
        </IconButton>
        <IconButton
          size="small"
          onClick={() =>
            window.open("https://www.instagram.com/icma.hk/", "_blank")
          }
        >
          <img
            src={igIcon}
            alt="ig"
            className={isMd ? "socialIconWeb" : "socialIconMobile"}
          />
        </IconButton>
        <IconButton
          size="small"
          onClick={() =>
            window.open("https://www.facebook.com/icma.hk", "_blank")
          }
        >
          <img
            src={facebookIcon}
            alt="facebook"
            className={isMd ? "socialIconWeb" : "socialIconMobile"}
          />
        </IconButton>
      </Stack>
    );
  };
  return type === "home" ? (
    <Box
      className={"webFooter"}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <img src={icmaIcon} alt="icma" className="icmaHomeFooterIcon" />
      <IconButtonStack />
      <img
        src={!isMd ? icmaHomeWebIcon : icmaHomeMobileIcon}
        alt="icmaHome"
        className={
          isMd
            ? "icmaHomeFooterIconBottomWeb"
            : "icmaHomeFooterIconBottomMobile"
        }
      />
    </Box>
  ) : (
    <Box
      sx={{
        marginTop: {
          md: "40px",
          sm: "0",
        },
        height: {
          md: "300px",
          sm: "200px",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "60px",
          marginTop: isMd ? "80px" : 0,
          borderTop: {
            md: "1px solid #FFF",
          },
          width: "40%",
        }}
      />
      <IconButtonStack />
      <img
        src={icmaVotePageIcon}
        alt="icmaVotePage"
        className={
          isMd ? "icmaVotePageBottomWebIcon" : "icmaVotePageBottomMobileIcon"
        }
      />
    </Box>
  );
};

export default Footer;
