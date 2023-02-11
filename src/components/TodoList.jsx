import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  Button,
  Container,
  FormControl,
  TextField,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useTheme } from "@emotion/react";

function TodoList() {
  const [text, setText] = useState("");
  const handleChange = (e) => setText(e.target.value);
  const theme = useTheme();

  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "todos"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setTodos(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  const addTodoToFirebase = async (text) => {
    try {
      await addDoc(collection(db, "todos"), {
        text: text,
        isDone: false,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document to Todos collection: ", error);
    }
  };

  const createTodo = (e) => {
    e.preventDefault();
    setText("");
    addTodoToFirebase(text);
  };

  const handleCheckboxChange = async (todo) => {
    const updatedTodo = { ...todo, isDone: !todo.isDone };
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t.id === todo.id ? updatedTodo : t))
    );
    const todoRef = doc(db, "todos", todo.id);

    const todoSnapshot = await getDoc(todoRef);
    if (todoSnapshot.exists) {
      await updateDoc(todoRef, {
        isDone: !todoSnapshot.data().isDone,
      });
    } else {
      throw new Error("Todo not found");
    }
  };

  const handleDelete = async (todo) => {
    try {
      await deleteDoc(doc(db, "todos", todo.id));
      setTodos(todos.filter((item) => item.id !== todo.id));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div>
        <Container maxWidth="sm"
        // backgroundColor={theme.palette.background.alt}
        >
          <form onSubmit={createTodo}>
            <FormControl
              fullWidth={true}
              sx={{
                marging: "3rem",
              }}
            >
              <TextField
                label="I will do this"
                variant="outlined"
                width="100px"
                onChange={handleChange}
                required={true}
                value={text}
              />
              <Button
                variant="contained"
                color="primary"
                width={100}
                style={{ marginTop: 5 }}
                type="submit"
              >
                <Add />
                Add
              </Button>
            </FormControl>
          </form>
        </Container>
      </div>
      <Container>
        {todos ? (
          <List sx={{ width: "100%", bgcolor: theme.palette.background.alt }}>
            {todos.map((todo, todoNo) => {
              const labelId = `checkbox-list-label-${todoNo}`;

              return (
                <ListItem
                  key={todoNo}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleDelete(todo)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    role={undefined}
                    dense
                    sx={{ cursor: "pointer" }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={todo.isDone ? true : false}
                        color="success"
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                        onClick={() => handleCheckboxChange(todo)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: 25,
                        fontWeight: "bold",
                      }}
                      id={labelId}
                      primary={todo.text}
                      onClick={() => handleCheckboxChange(todo)}
                      style={{
                        textDecoration: todo.isDone ? "line-through" : "",
                        ontWeight: "bold",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ) : null}
      </Container>
    </div>
  );
}
export default TodoList;
