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

  const handleDelete = async (id) => {
    try {
      await axios
        .delete(`http://localhost:5000/api/modules/${id}`)
        .then((res) => console.log(res.data));
      onDelete(id, "module");
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  if (!module) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to={`/equipments/module/edit/${module._id}`}>
        <button>Editar</button>
      </Link>
      <button onClick={() => handleDelete(module._id, "module")}>
        Excluir
      </button>
      <h2>
        Dados Técnicos: {module.model} - {module.maker}
      </h2>
      <p>
        {module.maxVoltage} W - Inmetro: {module.inmetro}
      </p>

      <h3>Dimensões</h3>
      <p>Comprimento: {module.length} m</p>
      <p>Largura: {module.width} V</p>

      <h3>Saída</h3>
      <p>Potência Máxima: {module.maxPower} W</p>
      <p>Tensão Máxima: {module.maxVoltage} A</p>
      <p>Corrente Máxima: {module.maxCurrent} A</p>

      {module.datasheetUrl && (
        <p>
          <a
            href={module.datasheetUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download do Datasheet
          </a>
        </p>
      )}
    </div>
  );
};

export default ModulePage;
