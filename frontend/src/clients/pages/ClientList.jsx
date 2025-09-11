import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/clients").then((res) => {
      setClients(res.data.data);
    });
  }, []);

  return (
    <div>
      <h1>Clientes</h1>
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/clients/form">
        <button>+ Novo Cliente</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={client._id} onClick={() => navigate(`/clients/${client._id}`)}>
              <td>{index + 1}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phoneNumber}</td>
              <td>{client.createdAt.split("T")[0].split("-").reverse().join("/")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
