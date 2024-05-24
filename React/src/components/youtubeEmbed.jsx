import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

const YoutubeEmbed = ({ embedId }) => (
  <Box
    className="video-responsive"
    sx={{
      marginLeft: {
        xs: 0,
        md: "10px",
      },
      // overflow: "hidden",
    }}
  >
    <iframe
      borderRadius="4"
      width="853"
      height="480"
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </Box>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default YoutubeEmbed;
