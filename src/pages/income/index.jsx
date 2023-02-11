import { useTheme } from "@emotion/react";

import { Box } from "@mui/material";
import { Link } from "react-router-dom";

import Header from "components/Header";
import StatBox from "components/StatBox";
import {  HomeOutlined } from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
function Income() {
  const theme = useTheme();

  const navItems = [
    {
      text: "PC",
      icon: <HomeOutlined sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}/>,
    },
    {
      text: "Article",
      icon: <InventoryIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}/>,
    },
    {
      text: "Maintenance",
      icon: <AttachMoneyIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}/>,
    }
   
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="REVENU" subtitle="Bienvenue dans votre Revenu" />
      <Box
        sx={{
          m: "5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            p: 1,
            m: 1,
          }}
        >
          {navItems.map(({ text, icon }) => {
            const lcText = text.toLowerCase();

            return (
              <Link
                to={`/${lcText}`}
                style={{
                  textDecoration: "none",
                }}
                key={text}
              >
                {" "}
                <StatBox
                  title={text}
                  wrap
                  flex={1}
                  icon={icon}
                  // onClick={() => {
                  //   navigate(`/${lcText}`);
                  // }}
                />
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default Income;
