import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import axios from "axios";

import Modal from "../components/Modal";
import ProjectForm from "../components/ProjectForm.jsx";
import SiteForm from "../components/SiteForm.jsx";

const ClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/clients/${id}`);
        setClient(res.data.data);
        setSelectedProject(res.data.data.projects[0] || null);
        console.log(res.data.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };
    fetchClient();
  }, [id]);

  const handleClientDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      navigate("/clients", { replace: true });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleOpenProjectForm = () => {
    setModalContent(<ProjectForm onClose={closeModal} onSubmit={handleProjectSubmit} clientId={id} />);
    setIsModalOpen(true);
  };

  const handleOpenSiteForm = () => {
    setModalContent(<SiteForm onClose={closeModal} projectId={selectedProject._id} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleProjectDelete = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      setClient((prevClient) => ({
        ...prevClient,
        projects: prevClient.projects.filter((p) => p._id !== projectId),
      }));
      setSelectedProject(client.projects.length > 1 ? client.projects[0] : null);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleProjectSubmit = async (projectTitle) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/projects`, {
        title: projectTitle,
        client: id,
        status: "draft",
      });
      setClient((prevClient) => ({
        ...prevClient,
        projects: [...prevClient.projects, res.data.data],
      }));
      if (!selectedProject) {
        setSelectedProject(res.data.data);
      }
    } catch (err) {
      console.error(err.response.data);
    }
    setIsModalOpen(false);
  };

  if (!client) return <div>Loading…</div>;

  return (
    <div>
      {isModalOpen && <Modal onClose={closeModal}>{modalContent}</Modal>}
      <Link to={`/clients/${id}/edit`}>
        <button>Editar</button>
      </Link>
      <button onClick={handleClientDelete}>Excluir</button>
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
      <button onClick={handleOpenProjectForm}>Add Project</button>
      <hr />

      <ul>
        {client.projects.map((project) => (
          <li key={project._id}>
            <button onClick={() => setSelectedProject(project)}>{project.title}</button>
          </li>
        ))}
      </ul>

      {selectedProject && (
        <div>
          <h2>Projeto Selecionado: {selectedProject.title}</h2>
          <button onClick={() => handleProjectDelete(selectedProject._id)}>Excluir Projeto</button>

          <h2>Locais</h2>
          <table>
            <thead>
              <tr>
                <td>Endereço</td>
                <td>Cidade</td>
                <td>Estado</td>
                <td>Ações</td>
              </tr>
            </thead>
            <tbody>
              {selectedProject.sites && selectedProject.sites.length > 0 ? (
                selectedProject.sites.map((site) => (
                  <tr key={site._id}>
                    <td>Logradouro</td>
                    <td>Cidade</td>
                    <td>Estado</td>
                    <td>
                      <button>Editar</button>
                      <button>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Nenhum local encontrado</td>
                </tr>
              )}
            </tbody>
          </table>

          <button onClick={handleOpenSiteForm}>Adicionar Local</button>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
