import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/clients").then((response) => {
      console.log(response);
      setClients(response.data.data);
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      setClients(clients.filter((client) => client._id !== id));
    } catch (err) {
      console.error(err?.response?.data || err);
    }
  };

  return (
    <div>
      <h1>Client List</h1>
      <Link to="/client-form">Add Client</Link>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr
              key={client._id}
              onClick={() => navigate(`/clients/${client._id}`)}
            >
              <td>{index + 1}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
