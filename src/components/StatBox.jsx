import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "./FlexBetween";

const StatBox = ({ title, value, increase, icon, description }) => {
  const theme = useTheme();
  return (
    <Box
    width={300}
      p="2rem"
      m="3rem"
      backgroundColor={theme.palette.background.alt}
      borderRadius="0.55rem"
    >
      <FlexBetween>
        <Typography
          variant="h2"
          color={theme.palette.secondary[100]}
          fontWeight="bold"
          sx={{ mb: "5px" }}
        >
          {title}
        </Typography>

        {icon}
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
