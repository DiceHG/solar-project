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
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <h1>Clientes</h1>

      {!clients || clients.length === 0 ? (
        <div>
          <p>Nenhum cliente encontrado. Deseja criar um?</p>
          <Link to="/clients/form">
            <button>+ Criar Cliente</button>
          </Link>
        </div>
      ) : (
        <>
          <Link to="/clients/form">
            <button>+ Criar Cliente</button>
          </Link>
          <table>
            <thead>
              <tr>
                <td>ID</td>
                <td>Nome</td>
                <td>Email</td>
                <td>Telefone</td>
                <td>Criado Em</td>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client._id} onClick={() => navigate(`/clients/${client._id}`)}>
                  <td>{client._id}</td>
                  <td>{client.name}</td>
                  <td>{client.email ? client.email : "N/A"}</td>
                  <td>{client.phoneNumber ? client.phoneNumber : "N/A"}</td>
                  <td>{client.createdAt.split("T")[0].split("-").reverse().join("/")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ClientList;
