import React from "react";
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Form from './pages/Form/Form';
import { AuthContext } from "../src/Components/AuthContext/AuthContext";
import Equipments from './pages/equipments/Equipments';
import Settings from './pages/Settings/Settings';
import EquipmentDetails from './pages/EquipmentDetails/EquipmentDetails';
import Allusers from './pages/Users/AllUsers';
import Adduser from './pages/Users/AddUser';
import Register from "./pages/Register/Register"
import Login from "./pages/Login/Login"
import Logout from "./pages/Logout/Logout"
import { Toaster } from 'react-hot-toast';
import Prediction from "./pages/Prediction/Prediction";
import Notifications from "./pages/Notifications/Notifications";

function App() {
  const {user} = React.useContext(AuthContext);
 

  return (
    <>
       <Toaster position="top-right" />
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={!user ?<Login /> :<Dashboard/>} />
        <Route path="/form" element={!user ?<Login /> :<Form />} />
        <Route path="/register" element={!user ? <Register /> : <Dashboard />} />
        <Route path="/login" element={!user ? <Login /> : <Dashboard />} />
        <Route  path="/logout" element={  <Logout />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/equipments/:id" element={!user ?<Login/>:<EquipmentDetails />} />
       <Route path="/settings" element={!user ?<Login/>:<Settings />} />
        <Route path="/equipments" element={!user ?<Login/>:<Equipments />} />
        <Route path="/form" element={!user ?<Login/>:<Form />} />
        <Route path="/users" element={!user ?<Login/>:<Allusers />} />
        <Route path="/adduser" element={!user ?<Login/>:<Adduser />} />
        <Route path="/notifications" element={!user ?<Login/>:<Notifications />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
