import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { Routes,Route } from "react-router-dom";
function App()
{
  return(
    <div>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
 
    </div>
   
  )
}

export default App;