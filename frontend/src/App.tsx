import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes,Route } from "react-router-dom";
function App()
{
  return(
    <div>
      <Routes>
        <Route path="/" element={<h1>Home</h1>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
 
    </div>
   
  )
}

export default App;