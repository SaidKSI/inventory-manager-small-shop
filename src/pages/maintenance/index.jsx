import React, { useEffect, useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
// import { useGetCustomersQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Expenses_Services_columns } from "../../datagridsource";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FlexBetween from "components/FlexBetween";
import Snackbare from "components/SnackBare";
import AddService from "pages/newitem/AddService";

function Maintenance() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(query(
      collection(db, "sales"),
      where("type", "==", "service")),

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
      await deleteDoc(doc(db, "products", id));
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
      <Header title="MAINTENANCE" subtitle="Liste des Maintenance" />
      <Typography variant="h5" color={theme.palette.secondary[300]}>
        Nouvelle Vente (Maintenance){" "}
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
      <AddService open={open} setOpen={setOpen} />
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
          columns={Expenses_Services_columns.concat(actionColumn)}
          components={{ Toolbar: DataGridCustomToolbar }}
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

export default Maintenance;
