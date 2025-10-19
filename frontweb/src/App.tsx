import { Box } from "@radix-ui/themes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreativeDetailPage from "./pages/CreativeDetailPage";
import NetworkStatus from "./components/NetworkStatus";
import NetworkSwitchNotification from "./components/NetworkSwitchNotification";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Box className="min-h-screen tech-bg grid-bg">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/creative/:id" element={<CreativeDetailPage />} />
          </Routes>
          <NetworkStatus />
          <NetworkSwitchNotification />
        </Box>
      </Router>
    </LanguageProvider>
  );
}

export default App;
