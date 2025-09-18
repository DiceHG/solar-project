import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const InverterPage = ({ inverterId, onDelete }) => {
  const [inverter, setInverter] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/inverters/${inverterId}`).then((res) => {
      setInverter(res.data.data);
    });
  }, [inverterId]);

  const handleDelete = async () => {
    try {
      await axios
        .delete(`http://localhost:5000/api/inverters/${inverterId}`)
        .then((res) => console.log(res.data));
      onDelete(inverterId, "inverter");
    } catch (error) {
      console.error("Error deleting inverter:", error);
    }
  };

  if (!inverter) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to={`/equipments/inverter/edit/${inverter._id}`}>
        <button>Editar</button>
      </Link>
      <button onClick={handleDelete}>Excluir</button>
      <h2>
        Dados Técnicos: {inverter.model} - {inverter.maker}
      </h2>
    </div>
  );
};

export default InverterPage;
