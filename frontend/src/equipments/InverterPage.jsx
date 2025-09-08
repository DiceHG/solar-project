import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

const InverterPage = ({ inverterId, onDelete }) => {
  const [inverter, setInverter] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/inverters/${inverterId}`)
      .then((res) => {
        setInverter(res.data.data);
      });
  }, [inverterId]);

  const handleDelete = async (id) => {
    try {
      await axios
        .delete(`http://localhost:5000/api/inverters/${id}`)
        .then((res) => console.log(res.data));
      onDelete(id, "inverter");
    } catch (error) {
      console.error("Error deleting inverter:", error);
    }
  };

  // console.log(inverter);

  if (!inverter) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to={`/equipments/inverter/edit/${inverter._id}`}>
        <button>Editar</button>
      </Link>
      <button onClick={() => handleDelete(inverter._id, "inverter")}>
        Excluir
      </button>
      <h2>
        Dados Técnicos: {inverter.model} - {inverter.maker}
      </h2>
      <p>
        {inverter.phaseType === "single-phase" ? "Monofásico" : "Trifásico"}{" "}
        {inverter.nominalVoltage} - Inmetro: {inverter.inmetro}
      </p>

      <h3>Entrada CC</h3>
      <p>Potência Máxima: {inverter.maxInputPower * 1000} W</p>
      <p>Tensão de Partida: {inverter.mpptConfig.startVoltage} V</p>
      <p>
        Faixa de Tensão: {inverter.inputVoltage.min} -{" "}
        {inverter.inputVoltage.max} V
      </p>
      <p>
        Corrente Máxima de Entrada:{" "}
        {inverter.mpptConfig.map((mppt) => mppt.maxInputCurrent).join(" / ")} A
      </p>
      <p>Número de MPPTS: {inverter.mpptConfig.length}</p>
      <p>
        Número de Strings:{" "}
        {inverter.mpptConfig.map((mppt) => mppt.stringCount).join(" / ")}
      </p>

      <h3>Saída CA</h3>
      <p>Potência Máxima: {inverter.maxOutputPower * 1000} W</p>
      <p>Tensão Máxima: {inverter.nominalVoltage} V</p>
      <p>Corrente Máxima: {inverter.maxOutputCurrent} A</p>
      <p>Frequência: {inverter.frequency} Hz</p>

      <h3>Eficiência</h3>
      <p>Eficiência Máxima: {inverter.efficiency} %</p>

      {inverter.datasheetUrl && (
        <p>
          <a
            href={inverter.datasheetUrl}
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

export default InverterPage;
