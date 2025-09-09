import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

import InverterPage from "./InverterPage";
import ModulePage from "./ModulePage";
import Modal from "../shared/components/Modal";

const EquipmentCatalog = () => {
  const [inverters, setInverters] = useState([]);
  const [modules, setModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

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

  const openModal = (type, equipment) => {
    setIsModalOpen(true);
    setSelectedEquipment({ type, equipment });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleDelete = (id, type) => {
    if (type === "inverter") {
      setInverters((prev) => prev.filter((inv) => inv._id !== id));
    } else if (type === "module") {
      setModules((prev) => prev.filter((mod) => mod._id !== id));
    }
    closeModal();
  };

  return (
    <>
      <Link to="/">
        <button>Home</button>
      </Link>
      {isModalOpen && (
        <Modal closeModal={closeModal}>
          {selectedEquipment.type === "inverter" ? (
            <InverterPage
              inverterId={selectedEquipment.equipment._id}
              onDelete={handleDelete}
            />
          ) : (
            <ModulePage
              moduleId={selectedEquipment.equipment._id}
              onDelete={handleDelete}
            />
          )}
        </Modal>
      )}
      <div>
        <h1>Equipamentos</h1>

        <h2>Módulos</h2>
        <Link to="/equipments/module/form">
          <button>Novo Módulo</button>
        </Link>
        <table>
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Fabricante</th>
              <th>Potência (kW)</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module._id} onClick={() => openModal("module", module)}>
                <td>{module.model}</td>
                <td>{module.maker}</td>
                <td>{module.maxPower}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Inversores</h2>
        <Link to="/equipments/inverter/form">
          <button>Novo Inversor</button>
        </Link>
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
              <tr
                key={inverter._id}
                onClick={() => openModal("inverter", inverter)}
              >
                <td>{inverter.model}</td>
                <td>{inverter.maker}</td>
                <td>{inverter.maxOutputPower}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EquipmentCatalog;
