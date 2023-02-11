import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@emotion/react";
import { db, storage } from "../../firebase";
import FlexBetween from "components/FlexBetween";
import { Box, IconButton, MenuItem } from "@mui/material";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Snackbare from "components/SnackBare";

export default function AddProduct({ open, setOpen }) {
  const theme = useTheme();
  const [products, setProducts] = useState({});
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("Operation completed successfully");
  console.log(products);
  const handleClose = () => {
    setOpen(false);
  };
  // add products
  const handleProductAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        ...products,
        in_stock: parseInt(products.in_stock),
        buy_price: parseFloat(products.buy_price),
        timestamp: serverTimestamp(),
      });
      setOpen(false);

      setAlertOpen(true);
      setStatus("success");
      setMessage("créé avec succès");
      setProducts({});
    } catch (error) {
      setAlertOpen(true);
      setStatus("error");
      setMessage("An error occurred during the operation");
      console.error("Error adding document to Brands collection: ", error);
    }
  };


  // image upload
  const [file, setFile] = useState("");
  const [ setPerc] = useState(null);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setProducts((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file, setPerc]);

  
  // console.log(brands);
  // console.log(categories);
  // console.log(products);
  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>New Product</DialogTitle>
        <DialogContent>
          <FlexBetween
            sx={{
              width: "600px",
              color: theme.palette.secondary[200],
            }}
          >
            <Box
              sx={{
                p: "1rem",
                color: theme.palette.secondary[200],
              }}
            >
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "10%",
                  objectFit: "cover",
                }}
              />
              <IconButton
                sx={{
                  color: theme.palette.secondary[200],
                }}
                color="primary"
                aria-label="upload picture"
                component="label"
                onChange={(e) => setFile(e.target.files[0])}
              >
                <IconButton
                  aria-label="upload picture"
                  component="label"
                  color={theme.palette.secondary[200]}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </IconButton>
              </IconButton>
            </Box>
            <Box
              sx={{
                width: "500px",
              }}
            >
              <TextField
                sx={{
                  m: "0.5rem",
                  color: theme.palette.secondary[200],
                }}
                autoFocus
                margin="dense"
                id="name"
                label="nom"
                autoComplete="off"
                type="text"
                variant="outlined"
                onChange={(e) =>
                  setProducts({ ...products, name: e.target.value })
                }
              />
              <TextField
                sx={{
                  m: "0.5rem",
                  color: theme.palette.secondary[200],
                }}
                autoFocus
                margin="dense"
                id="buy_price"
                label="Prix d'achat"
                type="number"
                variant="outlined"
                autoComplete="off"
                onChange={(e) =>
                  setProducts({ ...products, buy_price: e.target.value })
                }
              />
              <TextField
                sx={{
                  m: "0.5rem",
                  color: theme.palette.secondary[200],
                }}
                autoFocus
                margin="dense"
                id="in_stock"
                label="Stock"
                type="number"
                variant="outlined"
                autoComplete="off"
                onChange={(e) =>
                  setProducts({ ...products, in_stock: e.target.value })
                }
              />

                <TextField
                  id="outlined-select-currency"
                  select
                  fullWidth
                  label="Catégorie"
                  helperText="Please select Category"
                  sx={{
                    m: "0.5rem",
                    color: theme.palette.secondary[200],
                  }}
                  onChange={(e) =>
                    setProducts({ ...products, category: e.target.value })
                  }
                >
                  <MenuItem value="pc">PC</MenuItem>
                  <MenuItem value="article">Article</MenuItem>
                </TextField>
              
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
                  setProducts({ ...products, description: e.target.value })
                }
              />
            </Box>
          </FlexBetween>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleProductAdd}
            sx={{
              color: theme.palette.secondary[200],
            }}
          >
            Créer
          </Button>
        </DialogActions>
        <Snackbare
          status={status}
          message={message}
          open={alertOpen}
          setOpen={setAlertOpen}
        />
      </Dialog>
    </div>
  );
}
