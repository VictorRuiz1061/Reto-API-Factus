import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import InicioSecion from "./components/pages/inicioSesion";
import Facturas from "./components/templates/Facturas";

import NotFound from "./components/templates/Not404";

function App() {
  return (
      <Routes>
        <Route path="/" element={<InicioSecion />} />
        
        {/* Rutas protegidas */}
        <Route path="/Facturas" element={ <ProtectedRoute> <Facturas /> </ProtectedRoute> } />
        
        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
