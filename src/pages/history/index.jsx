import React, { useEffect, useState } from "react";
import { Box, IconButton, MenuItem, TextField, useTheme } from "@mui/material";
// import { useGetCustomersQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { Histotycolumns } from "../../datagridsource";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FlexBetween from "components/FlexBetween";
import Snackbare from "components/SnackBare";
import StatBoxSmall from "components/statBoxSmall";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
function Sales() {
  const theme = useTheme();
  // const { data, isLoading } = useGetCustomersQuery();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "sales"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        setData(list);
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "sales", id));
      setData(data.filter((item) => item.id !== id));
      setAlertOpen(true);
      setStatus("success");
      setMessage("Supprimé avec succès");
    } catch (err) {
      setAlertOpen(true);
      setStatus("error");
      setMessage("An error occurred during the operation");
      console.log(err);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <FlexBetween>
            <IconButton
              sx={{
                color: theme.palette.secondary[200],
              }}
              // onClick={handleClickOpen}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              sx={{
                color: theme.palette.secondary[200],
              }}
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </FlexBetween>
        );
      },
    },
  ];
  //REPORT
  const [salesTotal, setSalesTotal] = useState(0);
  const [servicesTotal, sertServicesTotal] = useState(0);
  const [shipmentTotal, setShipmentTotal] = useState(0);
  const [profit, setProfit] = useState(0);
  const [date, setDate] = useState("Today");

  useEffect(() => {
    async function fetchData() {
      let startAt;
      let endAt;
      let currentMonth = new Date();
      currentMonth.setMonth(currentMonth.getMonth(), 1);
      let currentWeek = new Date();
      currentWeek.setDate(currentWeek.getDate() - 7);
      let currentYear = new Date();
      currentYear.setFullYear(currentYear.getFullYear(), 0, 1);

      if (date === "Today") {
        startAt = new Date();
        startAt.setHours(0, 0, 0, 0);
        endAt = new Date();
        endAt.setHours(23, 59, 59, 999);
      } else if (date === "Current Week") {
        startAt = currentWeek;
        endAt = new Date();
        endAt.setDate(endAt.getDate() + 1);
      } else if (date === "Current Month") {
        startAt = currentMonth;
        endAt = new Date();
        endAt.setMonth(endAt.getMonth() + 1);
      } else if (date === "Current Year") {
        startAt = currentYear;
        endAt = new Date();
        endAt.setFullYear(endAt.getFullYear() + 1);
      }
      console.log(startAt)
      console.log(endAt)
      const salesTotal = query(
        collection(db, "sales"),
        where("type", "==", "sale"),
        where("timestamp", ">=", startAt),
        where("timestamp", "<=", endAt)
      );
      const salesQuerySnapshot = await getDocs(salesTotal);
      let total = 0;
      salesQuerySnapshot.forEach((doc) => {
        total += doc.data().sell_totalprice;
      });
      setSalesTotal(total);
      const servicesTotal = query(
        collection(db, "sales"),
        where("type", "==", "service"),
        where("timestamp", ">=", startAt),
        where("timestamp", "<=", endAt)
      );
      const servicessQuerySnapshot = await getDocs(servicesTotal);
      let totalServices = 0;
      servicessQuerySnapshot.forEach((doc) => {
        totalServices += doc.data().sell_profit;
      });
      sertServicesTotal(totalServices);

      const shipmentTotal = query(
        collection(db, "shipements"),
        where("timestamp", ">=", startAt),
        where("timestamp", "<", endAt)
      );
      const shipmentQuerySnapshot = await getDocs(shipmentTotal);
      let totalShipemet = 0;
      shipmentQuerySnapshot.forEach((doc) => {
        totalShipemet += doc.data().shipements_price;
      });
      setShipmentTotal(totalShipemet);
    }

    fetchData();
  }, [date]);
  useEffect(() => {
    setProfit(
      parseFloat(salesTotal) -
        parseFloat(shipmentTotal) +
        parseFloat(servicesTotal)
    );
  }, [salesTotal, shipmentTotal, servicesTotal]);
  console.log(servicesTotal);
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="History" subtitle="Liste de l'historique des ventes" />
      <TextField
        id="outlined-select-currency"
        select
        fullWidth
        label="Date"
        helperText="Please select the Date"
        sx={{
          m: "0.5rem",
          width: "250px",
          color: theme.palette.secondary[200],
        }}
        onChange={(e) => setDate(e.target.value)}
      >
        <MenuItem value="Today">Today</MenuItem>
        <MenuItem value="Current Week">Current Week</MenuItem>
        <MenuItem value="Current Month">Current Month</MenuItem>
        <MenuItem value="Current Year">Current Year</MenuItem>
      </TextField>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(6, 1fr)"
        gridAutoRows="160px"
        gap="20px"
      >
        <StatBoxSmall
          gridColumn="span 1"
          title="Revenu total"
          color="green"
          value={salesTotal ? salesTotal : 0}
          description={date}
          icon={<ArrowDropUpIcon sx={{ fontSize: "26px", color: "green" }} />}
        />
        <StatBoxSmall
          gridColumn="span 1"
          title="Profit"
          value={profit || servicesTotal ? profit + servicesTotal : 0}
          sx={{ color: profit < 0 ? "red" : "green" }}
          description={date}
          icon={
            profit < 0 ? (
              <ArrowDropDownIcon sx={{ color: "red", fontSize: "40px" }} />
            ) : (
              <ArrowDropUpIcon sx={{ color: "green", fontSize: "40px" }} />
            )
          }
        />
        <StatBoxSmall
          gridColumn="span 1"
          title="Dépenses Totales"
          value={shipmentTotal ? shipmentTotal : 0}
          description={date}
          sx={{}}
          icon={<ArrowDropDownIcon sx={{ fontSize: "26px", color: "red" }} />}
        />
      </Box>
      <Box
        mt="10px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row.id}
          rows={data || []}
          columns={Histotycolumns.concat(actionColumn)}
          components={{ Toolbar: DataGridCustomToolbar }}
          rowHeight={115}
        />
      </Box>
      <Snackbare
        status={status}
        message={message}
        open={alertOpen}
        setOpen={setAlertOpen}
      />
    </Box>
  );
}

export default Sales;
