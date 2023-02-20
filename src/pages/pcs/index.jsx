import React, { useEffect, useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Salescolumns } from "../../datagridsource";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FlexBetween from "components/FlexBetween";
import Snackbare from "components/SnackBare";
import AddSale from "pages/newitem/AddSale";

function PCSales() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(query(
      collection(db, "sales"),(
      where("type", "==", "sale"),
      where("product_category", "==", "pc"))),
      
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
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PCs" subtitle="Liste des PCs" />

      <Typography variant="h5" color={theme.palette.secondary[300]}>
        Nouvelle Vente (PC){" "}
        <IconButton
          sx={{
            color: theme.palette.secondary[200],
          }}
          onClick={handleClickOpen}
        >
          {" "}
          <AddCircleIcon
            fontSize="large"
            sx={{
              color: theme.palette.secondary[200],
            }}
          />
        </IconButton>
      </Typography>
      <AddSale open={open} setOpen={setOpen} category="pc" />
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
          columns={Salescolumns.concat(actionColumn)}
          components={{ Toolbar: GridToolbar }}
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

export default PCSales;
