import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const EquipmentCatalog = () => {
  const [inverters, setInverters] = useState([]);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchInverters = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/inverters");
        setInverters(res.data.data);
      } catch (error) {
        console.error("Error fetching inverters:", error);
      }
    };

    // const fetchModules = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:5000/api/modules");
    //     setModules(res.data.data);
    //   } catch (error) {
    //     console.error("Error fetching modules:", error);
    //   }
    // };

    fetchInverters();
    // fetchModules();
  }, []);

  const openModal = (inverter) => {
    alert(
      `Modelo: ${inverter.model}\nFabricante: ${inverter.maker}\nPotência Máxima de Saída: ${inverter.maxOutputPower} kW`
    );
  };

  return (
    <div>
      <h1>Equipamentos</h1>
      <Link to="/equipments/inverter/form">Novo Inversor</Link>
      {
        // TO DO LATER: Add modules back
        /* <h2>Módulos</h2>
      <ul>
        {modules.map((module) => (
          <li key={module._id}>{module.model}</li>
        ))}
      </ul> */
      }
      <h2>Inversores</h2>
      <table>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Fabricante</th>
            <th>Potência (kW)</th>
          </tr>
        </thead>
        <tbody>
          {inverters.map((inverter) => (
            <tr key={inverter._id} onClick={() => openModal(inverter)}>
              <td>{inverter.model}</td>
              <td>{inverter.maker}</td>
              <td>{inverter.maxOutputPower}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentCatalog;
