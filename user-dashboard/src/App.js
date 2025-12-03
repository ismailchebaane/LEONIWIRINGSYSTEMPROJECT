import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from "./components/user/FirstPage";
import SecondPage from "./components/user/SecondPage";
import ReadOnlyPage from "./components/documents/ReadOnlyPage";
import ReadWritePage from "./components/documents/ReadWritePage";
import LoginForm from "./components/auth/LoginForm";
import Logout from "./components/auth/Logout";
import PrivateRoute from "./components/auth/PrivateRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import NotFound from "./components/common/NotFound";
import { ToastContainer } from "react-toastify";
import Chatbot from "./pages/Chatbot";
import HeaderMenu from "./components/common/HeaderMenu"; // ✅ New component

function App() {
  return (
    <Router>
      <ToastContainer />
      <HeaderMenu /> {/* ✅ This has useNavigate and token logic */}
      <Navbar />

      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/second/" element={<SecondPage />} />
        <Route path="/read-only/:id" element={<ReadOnlyPage />} />
        <Route path="/read-write/:id" element={<PrivateRoute><ReadWritePage /></PrivateRoute>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Chatbot />
      <Footer />
    </Router>
  );
}

export default App;
