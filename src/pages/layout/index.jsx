import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "components/Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Box flexGrow={1}>
        <Navbar
          user={user[0] || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
