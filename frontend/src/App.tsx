import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// User pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminEvents from "./pages/AdminEvents";
import AdminGuests from "./pages/AdminGuest";


import UserProtectedRoute from "./routes/UserProtect";
import AdminProtectedRoute from "./routes/AdminProtect";


function App() {
  return (
    <>

    <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)"
          }
        }}
      />
     <Routes>

      <Route path="/" element={<Home/>} />

      <Route
        path="/login"
        element={
            <Login />
        }
      />

      <Route
        path="/register"
        element={
            <Register />
        }
      />

      
      <Route
        path="/"
        element={
          <UserProtectedRoute>
            <Home />
          </UserProtectedRoute>
        }
      />

      
      <Route
        path="/admin/login"
        element={
            <AdminLogin />
        }
      />

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="guests" element={<AdminGuests />} />
      </Route>

    </Routes>
    </>
   
  );
}

export default App;