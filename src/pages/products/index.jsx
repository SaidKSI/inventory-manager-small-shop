import React, { useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
// import { useGetCustomersQuery } from "state/api";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Productscolumns } from "../../datagridsource";
import AddProduct from "pages/newitem/AddProduct";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FlexBetween from "components/FlexBetween";
import Snackbare from "components/SnackBare";

function Products() {
  const theme = useTheme();
  // const { data, isLoading } = useGetCustomersQuery();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("");
 
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
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
  const [mode, setMode] = useState(false);

  return (
    <Box m="1.5rem 2.5rem">
      <FormControlLabel
        sx={{
          color: theme.palette.secondary[200],
          fontWeight: "bold",
        }}
        control={<Switch checked={mode} onChange={() => setMode(!mode)} />}
        label={mode ? "Card" : "Table"}
      />
      <Header title="PRODUCTS" subtitle="List of Products" />
      <Typography variant="h5" color={theme.palette.secondary[300]}>
      New Products  <IconButton
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
      <AddProduct open={open} setOpen={setOpen} />
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
          columns={Productscolumns.concat(actionColumn)}
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

export default Products;
