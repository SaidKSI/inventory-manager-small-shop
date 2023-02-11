import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { Button, IconButton } from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useTheme } from "@emotion/react";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await addDoc(collection(db, "profile"), {
        firstname: data.get("firstName"),
        lastname: data.get("lastName"),
        shopname: data.get("shopname"),
        phone: data.get("phone"),
        ...img,
      });
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };
  const [user, setUser] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "profile"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setUser(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const [file, setFile] = useState("");
  const [img, setIMG] = useState("");
  const [setPerc] = useState(null);

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
            setIMG((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <FlexBetween>
        {" "}
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
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="off"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="nom"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="prenom"
                  name="lastName"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="shopname"
                  label="Nom de la boutique"
                  name="shopname"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phone"
                  label="Numéro de Téléphone"
                  type="text"
                  id="phone"
                  autoComplete="off"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              width={50}
              sx={{ mt: 3, mb: 2 }}
            >
              Cree
            </Button>
          </Box>
        </Box>
      </FlexBetween>
    </Container>
  );
}
