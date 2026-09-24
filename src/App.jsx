import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import ServerInfo from "./pages/ServerInfo";
import Dashboard from "./pages/Dashboard";
import Content from "./pages/Content";
import DiscordCallback from "./pages/DiscordCallback";
import Partner from "./pages/Partner";
import SocialLinks from "./pages/SocialLinks";
import AddBot from "./pages/AddBot";
import Media from "./pages/Media";
import Utilities from "./pages/Utilities";
import Discover from "./pages/Discover";
import Advertise from "./pages/Advertise";
import ArticleEditor from "./pages/ArticleEditor";

function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/dashboard" ||
  location.pathname === "/content" ||
  location.pathname === "/content/new";
  
  return (
    <div className="cw-page">
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        {/* PUBLIC */}
        <Route path="/media" element={<Media />} />
        <Route path="/utilities" element={<Utilities />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/events" element={<Events />} />

        {/* CONTROL */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<Content />} />
        <Route path="/server-info" element={<ServerInfo />} />
        <Route path="/add-bot" element={<AddBot />} />
        <Route path="/content/new" element={<ArticleEditor />} />

        {/* AUTH */}
        <Route
          path="/auth/discord/callback"
          element={<DiscordCallback />}
        />

        {/* OTHER */}
        <Route path="/partner" element={<Partner />} />
        <Route path="/social-links" element={<SocialLinks />} />
      </Routes>

      <div
        className="cw-grain"
        aria-hidden="true"
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}