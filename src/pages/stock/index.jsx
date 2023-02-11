import { useTheme } from "@emotion/react";

import { Box } from "@mui/material";
import { Link } from "react-router-dom";

import Header from "components/Header";

import GroupsIcon from '@mui/icons-material/Groups';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StatBox from "components/StatBox";
function Stock() {
  const theme = useTheme();

  const navItems = [
    {
      text: "Expeditions",
      icon: <LocalShippingIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}/>,
    },
    {
      text: "Fournisseurs",
      icon: <GroupsIcon sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}/>,
    },
  
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="STOCK" subtitle="Bienvenue dans votre Stock" />
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
                
                />
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default Stock;
