import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@emotion/react";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Snackbare from "components/SnackBare";

export default function AddSupplier({ open, setOpen }) {
  const theme = useTheme();
  const [supplier, setSupplier] = useState("");
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("Operation completed successfully");

  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "suppliers"), {
        ...supplier,
        timestamp: serverTimestamp(),
      });
      setOpen(false);

      setAlertOpen(true);
      setStatus("success");
      setMessage("créé avec succès");
    } catch (error) {
      setAlertOpen(true);
      setStatus("error");
      setMessage("An error occurred during the operation");
      console.error("Error adding document to Brands collection: ", error);
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <DialogTitle>Nouveau fournisseur</DialogTitle>
        <DialogContent
          sx={{
            color: theme.palette.secondary[200],
          }}
        >
          <TextField
            sx={{
              width: "250px",
              m: "2rem",
            }}
            autoFocus
            margin="dense"
            id="full_name"
            label="nom"
            type="text"
            variant="outlined"
            autoComplete="off"
            onChange={(e) => setSupplier({ ...supplier, full_name: e.target.value })}
          />
          <TextField
            sx={{
              width: "250px",
              m: "2rem",
            }}
            autoFocus
            margin="dense"
            id="phone"
            label="Numéro de téléphone"
            type="text"
            variant="outlined"
            autoComplete="off"
            onChange={(e) =>
              setSupplier({ ...supplier, phone: e.target.value })
            }
          />
          <TextField
            sx={{
              width: "250px",
              m: "2rem",
            }}
            autoFocus
            margin="dense"
            id="address"
            label="Adresse"
            type="text"
            variant="outlined"
            autoComplete="off"
            onChange={(e) =>
              setSupplier({ ...supplier, address: e.target.value })
            }
          />
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
