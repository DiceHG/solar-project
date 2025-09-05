import { Routes, Route } from "react-router";
import ClientForm from "./clients/pages/ClientForm";
import ClientList from "./clients/pages/ClientList";
import ClientPage from "./clients/pages/ClientPage";
import InverterForm from "./equipments/pages/InverterForm";
import Equipments from "./equipments/pages/Equipments";
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
        <Route index element={<Equipments />} />
        <Route path="inverters/form" element={<InverterForm mode="create" />} />
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
