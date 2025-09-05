import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import axios from "axios";

const ClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/clients/${id}`);
        setClient(res.data.data);
      } catch (err) {
        console.error(err.response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      navigate("/clients", { replace: true });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  if (loading) return <div>Loading…</div>;
  if (!client) return <div>Client not found.</div>;

  return (
    <div>
      <h1>Client Page</h1>
      <Link to="/clients">Back to Clients</Link>
      <h2>{client.name}</h2>
      <p>Document Number: {client.docNumber}</p>
      <p>Email: {client.email}</p>
      <p>Phone Number: {client.phoneNumber}</p>

      <Link to={`/clients/${id}/edit`}>Edit Client</Link>
      <button onClick={handleDelete}>Delete Client</button>
    </div>
  );
};

export default ClientPage;
