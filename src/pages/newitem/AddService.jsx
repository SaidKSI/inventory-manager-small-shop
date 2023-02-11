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

export default function AddService({ open, setOpen }) {
  const theme = useTheme();
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState("Operation completed successfully");

  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "sales"), {
        description: service.description,
        type: "service",
        sell_profit: parseFloat(service.price),
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
      console.error("Error adding document to services collection: ", error);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth="md">
        <DialogTitle>Nouveaux Maintenance</DialogTitle>
        <DialogContent
          sx={{
            color: theme.palette.secondary[200],
            width: "350px",
          }}
        >
          <TextField
            id="standard-multiline-static"
            label="Description"
            multiline
            rows={4}
            fullWidth
            defaultValue=""
            sx={{
              width: "250px",
              m: "0.5rem",
              color: theme.palette.secondary[200],
            }}
            onChange={(e) =>
              setService({ ...service, description: e.target.value })
            }
          />
          <TextField
            sx={{
              m: "0.5rem",
              color: theme.palette.secondary[200],
              width: "250px",
            }}
            autoFocus
            margin="dense"
            id="price"
            label="Prix"
            type="number"
            variant="outlined"
            autoComplete="off"
            onChange={(e) => setService({ ...service, price: e.target.value })}
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
