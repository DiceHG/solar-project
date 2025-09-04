import { Routes, Route } from "react-router";
import ClientForm from "./components/ClientForm";
import ClientList from "./pages/ClientList";

const App = () => {
  return (
    <Routes>
      <Route index element={<div>Index</div>} />
      <Route path="clients" element={<ClientList />} />
      <Route path="client-form" element={<ClientForm />} />

      <Route>
        <Route path="login" element={<div>Login</div>} />
        <Route path="register" element={<div>Register</div>} />
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
