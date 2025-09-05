import React, { useEffect, useState } from "react";
import axios from "axios";

const Equipments = () => {
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

    const fetchModules = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/modules");
        setModules(res.data.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchInverters();
    fetchModules();
  }, []);
  console.log(inverters);

  return (
    <div>
      <h1>Equipamentos</h1>
      <h2>Inversores</h2>
      <ul>
        {inverters.map((inverter) => (
          <li key={inverter._id}>{inverter.model}</li>
        ))}
      </ul>
      <h2>Módulos</h2>
      <ul>
        {modules.map((module) => (
          <li key={module._id}>{module.model}</li>
        ))}
      </ul>
    </div>
  );
};

export default Equipments;
