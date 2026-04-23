import React from "react";
import { Box } from "@mui/system";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
// new footer center SVG
import icma2026Footer from "../assets/ICMA2026-Footer.png";
import fbFooter from "../assets/FB-Footer.svg";
import ytFooter from "../assets/YT-Footer.svg";
import igFooter from "../assets/IG-Footer.svg";

import "./styles/footer.css";

const Footer = ({ type, isMd, isInheritBackground, isFinal, isCompact }) => {
  // icon buttons removed per request; keep a placeholder component to avoid changing callers
  const IconButtonStack = () => {
    return null;
  };
  return type === "home" ? (
    <Box
      className={
        isInheritBackground
          ? "webFooterWithParentBackground"
          : isCompact
            ? "webFooter compactFooter"
            : "webFooter"
      }
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* center SVG */}
      <img
        src={icma2026Footer}
        alt="ICMA2026 Footer"
        className="icma2026FooterCenter"
      />
      <div className="footerSocials">
        <a
          href="https://www.facebook.com/icma.hk"
          target="_blank"
          rel="noreferrer"
        >
          <img src={fbFooter} alt="facebook" className="footerSocialIcon" />
        </a>
        <a
          href="https://www.youtube.com/@icma"
          target="_blank"
          rel="noreferrer"
        >
          <img src={ytFooter} alt="youtube" className="footerSocialIcon" />
        </a>
        <a
          href="https://www.instagram.com/icma.hk/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={igFooter} alt="instagram" className="footerSocialIcon" />
        </a>
      </div>
      <IconButtonStack />
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
          marginTop: isMd || isFinal ? "80px" : 0,
          borderTop: {
            md: "1px solid #FFF",
            xs: isFinal == true ? "1px solid #FFF" : "",
          },
          width: "40%",
        }}
      />
      {/* center SVG */}
      <img
        src={icma2026Footer}
        alt="ICMA2026 Footer"
        className="icma2026FooterCenter"
      />
      <div className="footerSocials">
        <a
          href="https://www.facebook.com/icma.hk"
          target="_blank"
          rel="noreferrer"
        >
          <img src={fbFooter} alt="facebook" className="footerSocialIcon" />
        </a>
        <a
          href="https://www.youtube.com/@icma"
          target="_blank"
          rel="noreferrer"
        >
          <img src={ytFooter} alt="youtube" className="footerSocialIcon" />
        </a>
        <a
          href="https://www.instagram.com/icma.hk/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={igFooter} alt="instagram" className="footerSocialIcon" />
        </a>
      </div>
      <IconButtonStack />
    </Box>
  );
};

export default Footer;
