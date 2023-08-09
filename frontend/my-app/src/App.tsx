import Home from './components/Home';
import {WeatherComponent} from './components/Weather'; 
import Login from './components/Login';
import Register from './components/Register';
import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Admin } from './components/Admin';



function App() { 
  return (
    <BrowserRouter> 
    <div className="App"> 
      <h3 className="d-flex justify-content-center m-3"> 
        WeatherApp Home Page!
      </h3>

      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <div className="container d-flex justify-content-between" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div>
            <NavLink className="btn btn-light btn-outline-primary m-1" to="/home">
              Home
            </NavLink>
            <NavLink className="btn btn-light btn-outline-primary m-1" to="/weather">
              Weather
            </NavLink>
            <NavLink className="btn btn-light btn-outline-primary m-1" to="/admin">
              Admin
            </NavLink>
          </div>
          <div>
            <NavLink className="btn btn-light btn-outline-primary m-1" to="/login">
              Login
            </NavLink>
            <NavLink className="btn btn-light btn-outline-primary m-1" to="/register">
              Register
            </NavLink>
          </div>
        </div>
      </nav>



      <Routes> 
        <Route path="/home" element={<Home/>}/> 
        <Route path="/weather" element={<WeatherComponent/>}/> 
        <Route path="/admin" element={<Admin/>}/> 
        <Route path="/login" element={<Login/>}/> 
        <Route path="/register" element={<Register/>}/> 
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
