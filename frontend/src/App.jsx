import { Routes, Route } from "react-router";
import ClientForm from "./clients/ClientForm";
import ClientList from "./clients/ClientList";
import ClientPage from "./clients/ClientPage";
import EquipmentCatalog from "./equipments/EquipmentCatalog";
import InverterForm from "./equipments/InverterForm";
import ModuleForm from "./equipments/ModuleForm";
import Index from "./Index";

const App = () => {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="clients">
        <Route index element={<ClientList />} />
        <Route path="form" element={<ClientForm mode="create" />} />
        <Route path=":id" element={<ClientPage />} />
        <Route path=":id/edit" element={<ClientForm mode="edit" />} />
      </Route>

      <Route path="equipments">
        <Route index element={<EquipmentCatalog />} />
        <Route path="inverter/form" element={<InverterForm mode="create" />} />
        <Route
          path="inverter/edit/:id"
          element={<InverterForm mode="edit" />}
        />
        <Route path="module/form" element={<ModuleForm mode="create" />} />
        <Route path="module/edit/:id" element={<ModuleForm mode="edit" />} />
      </Route>

      <Route path="concerts">
        <Route index element={<div>Concerts Home</div>} />
        <Route path=":city" element={<div>City</div>} />
        <Route path="trending" element={<div>Trending</div>} />
      </Route>
    </Routes>
  );
};

export default App;
