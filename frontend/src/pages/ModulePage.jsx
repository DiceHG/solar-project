import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const ModulePage = ({ moduleId, onDelete }) => {
  const [module, setModule] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/modules/${moduleId}`).then((res) => {
      setModule(res.data.data);
    });
  }, [moduleId]);

  const handleDelete = async () => {
    try {
      await axios
        .delete(`http://localhost:5000/api/modules/${moduleId}`)
        .then((res) => console.log(res.data));
      onDelete(moduleId, "module");
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  if (!module) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to={`/equipments/module/edit/${moduleId}`}>
        <button>Editar</button>
      </Link>
      <button onClick={handleDelete}>Excluir</button>
      <h2>
        Dados Técnicos: {module.model} - {module.maker}
      </h2>
    </div>
  );
};

export default ModulePage;
