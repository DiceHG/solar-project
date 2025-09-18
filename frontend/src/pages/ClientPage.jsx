import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import axios from "axios";

import Modal from "../components/Modal";

const ProjectForm = ({ onClose, clientId }) => {
  const [projectTitle, setProjectTitle] = useState("");

  const handleChange = (e) => {
    setProjectTitle(e.target.value);
  };

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5000/api/projects", {
      title: projectTitle,
      client: clientId,
      status: "draft",
    });
    console.log(res.data);
  };

  return (
    <div>
      <button onClick={onClose}>X</button>
      <label htmlFor="projectTitle">Título do Projeto</label>
      <input type="text" id="projectTitle" value={projectTitle} onChange={handleChange} />
      <button onClick={handleSubmit}>Adicionar</button>
    </div>
  );
};

const ClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/clients/${id}`);
        setClient(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.error(err.response.data);
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

  if (!client) return <div>Loading…</div>;

  return (
    <div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ProjectForm onClose={() => setIsModalOpen(false)} clientId={id} />
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
        {client.entityType === "individual" ? "CPF" : "CNPJ"}: {client.docNumber}
      </p>
      <p>Email: {client.email}</p>
      <p>Telefone: {client.phoneNumber}</p>
      <hr />
      <button onClick={() => setIsModalOpen(true)}>Add Project</button>
      <hr />
    </div>
  );
};

export default ClientPage;
