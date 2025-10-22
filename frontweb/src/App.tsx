import { Box } from "@radix-ui/themes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreativeDetailPage from "./pages/CreativeDetailPage";
import CreativeExplore from "./pages/CreativeExplore";
import CreativeSubmitPage from "./pages/CreativeSubmitPage";
import TestExplore from "./pages/TestExplore";
import PointsPage from "./pages/PointsPage";
import MyPointsPage from "./pages/MyPointsPage";
import LikeTestPage from "./pages/LikeTestPage";
import MyAssetsPage from "./pages/MyAssetsPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import NetworkStatus from "./components/NetworkStatus";
import NetworkSwitchNotification from "./components/NetworkSwitchNotification";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useSuiClientContext } from '@mysten/dapp-kit';

function AppContent() {
  const { network } = useSuiClientContext();
  
  // 如果是主网，显示敬请期待页面
  if (network === 'mainnet') {
    return <ComingSoonPage />;
  }

  return (
    <Box className="min-h-screen tech-bg grid-bg">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/creative/:id" element={<CreativeDetailPage />} />
        <Route path="/explore" element={<CreativeExplore />} />
        <Route path="/submit" element={<CreativeSubmitPage />} />
        <Route path="/test" element={<TestExplore />} />
        <Route path="/points" element={<PointsPage />} />
        <Route path="/my-points" element={<MyPointsPage />} />
        <Route path="/like-test" element={<LikeTestPage />} />
        <Route path="/my-assets" element={<MyAssetsPage />} />
      </Routes>
      <NetworkStatus />
      <NetworkSwitchNotification />
    </Box>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
