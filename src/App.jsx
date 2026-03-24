import { useContext } from "react";

import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const { user } = useContext(AuthContext);

  return user ? <Dashboard /> : <Login />;
}

export default App;