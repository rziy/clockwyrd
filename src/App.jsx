import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./lib/auth";
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
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();
  const { user, loading } = useAuth();
  if (loading) return <main className="flex min-h-[100dvh] items-center justify-center bg-[#07101d] text-[#edf5ff]"><div className="text-center"><p className="cw-label text-[#6fa8ff]">CLOCKWYRD</p><p className="mt-4 text-sm text-[#8ea2ba]">Checking session…</p></div></main>;
  const controlArea = ["/dashboard", "/content", "/content/new"].includes(location.pathname) || location.pathname.startsWith("/content/");

  return (
    <div className="cw-page">
      {!controlArea && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/media" element={<Media />} />
        <Route path="/media/:id" element={<Media />} />
        <Route path="/utilities" element={<Utilities />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/events" element={<Events />} />
        <Route path="/server-info" element={<ServerInfo />} />
        <Route path="/add-bot" element={<AddBot />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/social-links" element={<SocialLinks />} />
        <Route path="/auth/discord/callback" element={<DiscordCallback />} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
        <Route path="/content" element={<ProtectedRoute user={user}><Content /></ProtectedRoute>} />
        <Route path="/content/new" element={<ProtectedRoute user={user}><ArticleEditor /></ProtectedRoute>} />
        <Route path="/content/:id/edit" element={<ProtectedRoute user={user}><ArticleEditor /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="cw-grain" aria-hidden="true" />
    </div>
  );
}

export default function App() {
  return <BrowserRouter><ErrorBoundary><AuthProvider><AppContent /></AuthProvider></ErrorBoundary></BrowserRouter>;
}
