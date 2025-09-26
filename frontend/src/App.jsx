import { Routes, Route } from "react-router";
import ClientForm from "./pages/ClientForm";
import ClientList from "./pages/ClientList";
import ClientPage from "./pages/ClientPage";
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

      <Route path="catalog">
        <Route index element={<Catalog />} />
        <Route path="inverter/form" element={<InverterForm mode="create" />} />
        <Route path="inverter/:id" element={<InverterForm mode="edit" />} />
        <Route path="inverter/:id/edit" element={<InverterPage />} />
        <Route path="module/form" element={<ModuleForm mode="create" />} />
        <Route path="module/:id" element={<ModulePage />} />
        <Route path="module/:id/edit" element={<ModuleForm mode="edit" />} />
      </Route>
    </Routes>
  );
};

export default App;
