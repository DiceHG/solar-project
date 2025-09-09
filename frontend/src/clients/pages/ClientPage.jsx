import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import axios from "axios";

import ProjectForm from "../components/ProjectForm";
import Modal from "../../shared/components/Modal";

const ClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/clients/${id}`);
        setClient(res.data.data);
        console.log(res.data.data);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      {isModalOpen && (
        <Modal closeModal={handleCloseModal}>
          <ProjectForm client={id} />
        </Modal>
      )}
      <Link to={`/clients/${id}/edit`}>
        <button>Editar</button>
      </Link>
      <button onClick={handleDelete}>Excluir</button>
      <h1>Cliente: {client.name}</h1>
      <Link to="/clients">
        <button>Voltar</button>
      </Link>
      <p>
        {client.clientType === "individual" ? "CPF" : "CNPJ"}:{" "}
        {client.docNumber}
      </p>
      <p>Email: {client.email}</p>
      <p>Telefone: {client.phoneNumber}</p>
      <hr />
      <button onClick={handleOpenModal}>Add Project</button>
    </div>
  );
};

export default ClientPage;
