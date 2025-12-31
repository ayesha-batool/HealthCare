import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import ProvidersPage from "./pages/ProvidersPage";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book" element={<CreatePage />} />
        <Route path="/providers" element={<ProvidersPage />} />
      </Routes>
    </Box>
  );
};

export default App;
