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
  where,
  serverTimestamp,
  query,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Snackbare from "components/SnackBare";
import FlexBetween from "components/FlexBetween";
import { Autocomplete, Checkbox, IconButton, Typography } from "@mui/material";
import AddProduct from "./AddProduct";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

export default function AddSale({ open, setOpen, category }) {
  const theme = useTheme();
  const [sale, setSale] = useState("");
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("Operation completed successfully");
console.log(sale)
  const handleClose = () => {
    setOpen(false);
    setSale("");
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      // Add the sale record to the "sales" collection
      await addDoc(collection(db, "sales"), {
        ...sale,
        type: "sale",
        product_sell_price: parseFloat(sale.sell_price),
        sell_qantity: parseFloat(sale.qantity),
        timestamp: serverTimestamp(),
        sell_totalprice: totalprice,
        product_profit: parseFloat(
          parseFloat(sale.sell_price) - sale.product_buy_price
        ),
        sell_profit: parseFloat(
          totalprice - sale.qantity * sale.product_buy_price
        ),
      });

      const productRef = doc(db, "products", sale.product_id);

      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists) {
        await updateDoc(productRef, {
          in_stock: productSnapshot.data().in_stock - sale.qantity,
        });
      } else {
        throw new Error("Product not found");
      }
      setOpen(false);
      setAlertOpen(true);
      setStatus("success");
      setMessage("créé avec succès");
    } catch (error) {
      setAlertOpen(true);
      setStatus("error");
      setMessage("An error occurred during the operation");
      console.error("Error updating product in_stock: ", error);
    }
  };

  const [openProduct, setOpenProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalprice, setTotalPrice] = useState(0);
  const handleClickOpenProduct = () => {
    setOpenProduct(true);
  };
  useEffect(() => {
    const q = query(
      collection(db, "products"),
      where("in_stock", ">", 0),
      where("category", "==", category)
    );
    getDocs(q)
      .then((querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setProducts(list);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [category]);
  useEffect(() => {
    setTotalPrice(sale.sell_price * sale.qantity);
  }, [sale.sell_price, sale.qantity]);

  console.log(sale);
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  console.log(sale);
  // console.log(products);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Nouvelle Vente</DialogTitle>
        <DialogContent
          sx={{
            p: "2rem",
            color: theme.palette.secondary[200],
          }}
        >
          <FlexBetween>
            <Autocomplete
              id="highlights-demo"
              sx={{ width: 215, m: "0.5rem" }}
              options={products}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Highlights" margin="normal" />
              )}
              onChange={(e, value) =>
                setSale({
                  ...sale,
                  product_id: value.id,
                  product_name: value.name,
                  product_buy_price: value.buy_price,
                  product_in_stock: value.in_stock,
                  product_category : value.category,
                })
              }
              renderOption={(props, option, { inputValue }) => {
                const matches = match(option.name, inputValue, {
                  insideWords: true,
                });
                const parts = parse(option.name, matches);

                return (
                  <li {...props}>
                    <div>
                      {parts.map((part, index) => (
                        <span
                          key={index}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              }}
            />
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
          {sale.product_id && (
            <>
              <FlexBetween>
                {" "}
                <TextField
                  sx={{
                    m: "0.5rem",
                    color: theme.palette.secondary[200],
                  }}
                  autoFocus
                  margin="dense"
                  id="sell_price"
                  label="Prix ​​de Vente"
                  defaultValue={sale.buy_price}
                  type="number"
                  variant="outlined"
                  autoComplete="off"
                  onChange={(e) =>
                    setSale({ ...sale, sell_price: e.target.value })
                  }
                />
                {sale.product_buy_price}
              </FlexBetween>
              <FlexBetween>
                {" "}
                <TextField
                  sx={{
                    m: "0.5rem",
                    color: theme.palette.secondary[200],
                  }}
                  autoFocus
                  margin="dense"
                  id="qantity"
                  label="Quantité"
                  defaultValue={1}
                  type="number"
                  variant="outlined"
                  autoComplete="off"
                  onChange={(e) =>
                    setSale({ ...sale, qantity: e.target.value })
                  }
                />{" "}
                {sale.product_in_stock}
              </FlexBetween>
              <span>Observation</span>
              <Checkbox
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
              {checked && (
                <TextField
                  id="standard-multiline-static"
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  defaultValue=""
                  sx={{
                    m: "0.5rem",
                    color: theme.palette.secondary[200],
                  }}
                  onChange={(e) =>
                    setSale({ ...products, description: e.target.value })
                  }
                />
              )}
              <Typography variant="h6" color={theme.palette.secondary[300]}>
                {" "}
                Prix ​​Total : {totalprice ? totalprice : 0}
              </Typography>
            </>
          )}
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
