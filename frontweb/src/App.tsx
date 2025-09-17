import { Box } from "@radix-ui/themes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreativeDetailPage from "./pages/CreativeDetailPage";

function App() {
  return (
    <Router>
      <Box className="min-h-screen tech-bg grid-bg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/creative/:id" element={<CreativeDetailPage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
