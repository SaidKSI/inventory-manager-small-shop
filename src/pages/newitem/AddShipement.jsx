import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@emotion/react";
import { db } from "../../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Snackbare from "components/SnackBare";
import FlexBetween from "components/FlexBetween";
import {
  
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddSupplier from "./AddSupplier";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProduct from "./AddProduct";

export default function AddShipement({ open, setOpen }) {
  const theme = useTheme();
  const [shipement, setShipement] = useState({});
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("Operation completed successfully");

  const handleClose = () => {
    setOpen(false);
  };
  // console.log(shipement);
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "shipements"), {
        ...shipement,
        shipements_price: parseFloat(shipement.totalPrice),

        timestamp: serverTimestamp(),
      });
      setOpen(false);

      setAlertOpen(true);
      setStatus("success");
      setMessage("créé avec succès");
      setSelectedProduct([]);
    } catch (error) {
      setAlertOpen(true);
      setStatus("error");
      setMessage("An error occurred during the operation");
      console.error("Error adding document to Brands collection: ", error);
    }
  };
  // suppliers
  const [openSupplier, setOpenSupplier] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);

  const handleClickOpenSupplier = () => {
    setOpenSupplier(true);
  };
  const handleClickOpenProduct = () => {
    setOpenProduct(true);
  };
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubBrands = onSnapshot(
      collection(db, "suppliers"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setSuppliers(list);
      },
      (error) => {
        console.log(error);
      }
    );

    const unsubCategories = onSnapshot(
      collection(db, "products"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setProducts(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubBrands();
      unsubCategories();
    };
  }, []);
  // select products
  const [selectedProduct, setSelectedProduct] = useState();
  const [productList, setProductList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleAddProducts = () => {
    if (!selectedProduct) {
      return;
    }
    const productIds = productList.map((product) => product.id);
    if (productIds.includes(selectedProduct.id)) {
      return;
    }
    setProductList([...productList, selectedProduct]);
    setAlertOpen(true);
    setStatus("success");
    setMessage("Product has been added");
  };

  const handleDelete = (productId) => {
    setProductList(productList.filter((product) => product.id !== productId));
  };

  useEffect(() => {
    let price = 0;
    productList.forEach((product) => {
      price += product.price * product.in_stock;
    });
    setTotalPrice(price);
    setShipement({
      ...shipement,
      totalPrice: totalPrice,
      products: productList,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productList, totalPrice]);
  // console.log(shipement);
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>New Shipement</DialogTitle>
        <DialogContent
          sx={{
            ml: "3rem 0.5rem",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "start",
            flexDirection: "column",
            color: theme.palette.secondary[200],
          }}
        >
          <FlexBetween>
            <TextField
              id="outlined-select-currency"
              select
              label="Fournisseurs"
              helperText="Veuillez sélectionner le fournisseur"
              sx={{
                m: "0.2rem",
                width: 250,
                color: theme.palette.secondary[200],
              }}
              onChange={(e) =>
                setShipement({ ...shipement, supplier: e.target.value })
              }
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.full_name} value={supplier.full_name}>
                  {supplier.full_name}
                </MenuItem>
              ))}
            </TextField>
            <IconButton
              sx={{
                color: theme.palette.secondary[200],
              }}
              onClick={handleClickOpenSupplier}
            >
              {" "}
              <AddCircleIcon fontSize="large" />
            </IconButton>
            <AddSupplier open={openSupplier} setOpen={setOpenSupplier} />
          </FlexBetween>
          <FlexBetween>
            <TextField
              id="outlined-select-currency"
              select
              label="Product"
              helperText="Veuillez sélectionner le produit"
              sx={{
                m: "0.2rem",
                width: 250,
                color: theme.palette.secondary[200],
              }}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  id: e.target.value.id,
                  name: e.target.value.name,
                  price: e.target.value.buy_price,
                  in_stock: e.target.value.in_stock,
                })
              }
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
            <IconButton
              sx={{
                color: theme.palette.secondary[200],
              }}
              onClick={handleClickOpenProduct}
            >
              {" "}
              <AddCircleIcon fontSize="large" />
            </IconButton>
            <AddProduct open={openProduct} setOpen={setOpenProduct} />
          </FlexBetween>
          <IconButton
            sx={{
              color: theme.palette.secondary[200],
            }}
            onClick={handleAddProducts}
          >
            {" "}
            <AddCircleIcon fontSize="large" />
          </IconButton>
          <TableContainer component={Paper}>
            <>
              <Table
                aria-label="a dense table"
                sx={{ minWidth: 300, textSizeAdjust: "small" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell width="150px" align="center">
                      Name
                    </TableCell>
                    <TableCell width="100px" align="center">
                      Prix
                    </TableCell>
                    <TableCell width="100px" align="center">
                    Quantité
                    </TableCell>
                    <TableCell width="100px" align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productList.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" align="center">
                        {product.name}
                      </TableCell>
                      <TableCell align="center">{product.price}</TableCell>
                      <TableCell align="center">{product.in_stock}</TableCell>
                      <TableCell align="center">
                        {" "}
                        <Button
                          sx={{
                            color: theme.palette.secondary[200],
                          }}
                          onClick={() => handleDelete(product.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography
                sx={{
                  mt: "1.5rem",
                  ml: "300px",
                }}
              >
                Prix ​​total:{totalPrice}
              </Typography>
            </>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAdd}
            sx={{
              m: "0.1rem",
              color: theme.palette.secondary[200],
            }}
          >
           Créer
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbare
        status={status}
        message={message}
        open={alertOpen}
        setOpen={setAlertOpen}
      />
    </div>
  );
}
