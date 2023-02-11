import { useTheme } from "@emotion/react";

import { Box } from "@mui/material";
import { Link } from "react-router-dom";

import Header from "components/Header";
import StatBox from "components/StatBox";
import { HistoryOutlined, HomeOutlined } from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import FlexBetween from "components/FlexBetween";
import TodoList from "components/TodoList";
function Dashboard() {
  const theme = useTheme();

  const navItems = [
    {
      text: "Profile",
      icon: (
        <HomeOutlined
          sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
        />
      ),
    },
    {
      text: "Stock",
      icon: (
        <InventoryIcon
          sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
        />
      ),
    },
    {
      text: "Revenu",
      icon: (
        <AttachMoneyIcon
          sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
        />
      ),
      income: true,
    },
    {
      text: "History",
      icon: (
        <HistoryOutlined
          sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
        />
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="DASHBOARD"
        subtitle="Bienvenue sur votre tableau de bord"
      />
      <Box
        sx={{
          m: "5rem",
        }}
      >
        <FlexBetween
          sx={{
            flexWrap: "wrap",
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
                <StatBox  title={text} wrap flex={0.4} icon={icon} />
              </Link>
            );
          })}
        </FlexBetween>
        <Box
          
          width={500}
          
          sx={{
            mt: "2rem",
            ml:"40%"
          }}
        >
          <TodoList />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
