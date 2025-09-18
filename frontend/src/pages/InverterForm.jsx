import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inverterSchema } from "../schemas/inverter.schema";

const InverterForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const defaultMppt = () => ({
    dcMaxCurrent: "",
    scCurrent: "",
    pvStringCount: 1,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inverterSchema),
    defaultValues: { mpptConfig: [defaultMppt()] },
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const res = await axios.get(`http://localhost:5000/api/inverters/${id}`);
        const inverter = res.data.data;
        reset({
          ...inverter,
        });
      })();
    }
  }, [mode, id, reset]);

  const onSubmit = async (data) => {
    let res;
    try {
      if (mode === "create") {
        res = await axios.post("http://localhost:5000/api/inverters", data);
      } else if (mode === "edit") {
        res = await axios.put(`http://localhost:5000/api/inverters/${id}`, data);
      }
      console.log(res.data);
      navigate(`/equipments`, { replace: true });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "mpptConfig",
  });

  return (
    <>
      <h1>{mode === "create" ? "Cadastrar Inversor" : "Editar Inversor"}</h1>
      <Link to="/equipments">
        <button>Voltar</button>
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information */}
        <fieldset>
          <legend>Informações Básicas</legend>
          <label htmlFor="model">Modelo*</label>
          <input {...register("model")} id="model" />
          <p>{errors.model?.message}</p>

          <label htmlFor="maker">Fabricante*</label>
          <input {...register("maker")} id="maker" />
          <p>{errors.maker?.message}</p>

          <label htmlFor="inmetro">Inmetro*</label>
          <input {...register("inmetro")} id="inmetro" />
          <p>{errors.inmetro?.message}</p>

          <label htmlFor="price">Preço*</label>
          <input {...register("price")} id="price" type="number" inputMode="numeric" step="any" />
          <p>{errors.price?.message}</p>
        </fieldset>
        {/* Input DC */}
        <fieldset>
          <legend>Entrada CC</legend>
          <label htmlFor="dcMaxPower">Máxima Potência (W)*</label>
          <input {...register("dcMaxPower")} id="dcMaxPower" type="number" inputMode="numeric" />
          <p>{errors.dcMaxPower?.message}</p>

          <label htmlFor="dcNominalVoltage">Tensão Nominal (V)</label>
          <input {...register("dcNominalVoltage")} id="dcNominalVoltage" type="number" inputMode="numeric" />
          <p>{errors.dcNominalVoltage?.message}</p>

          <p>Tensão (V)</p>
          <label htmlFor="dcVoltage.min">Mínima*</label>
          <input {...register("dcVoltage.min")} id="dcVoltage.min" type="number" inputMode="numeric" />
          <p>{errors.dcVoltage?.min?.message}</p>

          <label htmlFor="dcVoltage.max">Máxima*</label>
          <input {...register("dcVoltage.max")} id="dcVoltage.max" type="number" inputMode="numeric" />
          <p>{errors.dcVoltage?.max?.message}</p>

          <label htmlFor="startUpVoltage">Tensão de Partida (V)</label>
          <input {...register("startUpVoltage")} id="startUpVoltage" type="number" inputMode="numeric" />
          <p>{errors.startUpVoltage?.message}</p>
        </fieldset>
        {/* MPPT Configuration */}
        {fields.map((f, i) => (
          <fieldset key={f.id}>
            <legend>MPPT {i + 1}</legend>
            <button type="button" onClick={() => remove(i)} hidden={fields.length === 1}>
              Remover
            </button>
            <br />

            <label htmlFor={`mpptConfig.${i}.dcMaxCurrent`}>Corrente Máxima (A)*</label>
            <input
              {...register(`mpptConfig.${i}.dcMaxCurrent`)}
              id={`mpptConfig.${i}.dcMaxCurrent`}
              type="number"
              inputMode="numeric"
              step="any"
            />
            <p>{errors.mpptConfig?.[i]?.dcMaxCurrent?.message}</p>

            <label htmlFor={`mpptConfig.${i}.scCurrent`}>Corrente de Curto Circuito (A)</label>
            <input
              {...register(`mpptConfig.${i}.scCurrent`)}
              id={`mpptConfig.${i}.scCurrent`}
              type="number"
              inputMode="numeric"
              step="any"
            />
            <p>{errors.mpptConfig?.[i]?.scCurrent?.message}</p>

            <label htmlFor={`mpptConfig.${i}.pvStringCount`}>Número de Strings*</label>
            <input
              {...register(`mpptConfig.${i}.pvStringCount`)}
              id={`mpptConfig.${i}.pvStringCount`}
              type="number"
              inputMode="numeric"
            />
            <p>{errors.mpptConfig?.[i]?.pvStringCount?.message}</p>
          </fieldset>
        ))}
        <button type="button" onClick={() => append(defaultMppt())}>
          + Adicionar MPPT
        </button>{" "}
        <br />
        {/* Output AC */}
        <fieldset>
          <legend>Saída CA</legend>
          <label htmlFor="acNominalPower">Potência Nominal (W)*</label>
          <input {...register("acNominalPower")} id="acNominalPower" type="number" inputMode="numeric" />
          <p>{errors.acNominalPower?.message}</p>

          <label htmlFor="acNominalVoltage">Tensão Nominal (V)*</label>
          <input {...register("acNominalVoltage")} id="acNominalVoltage" type="number" inputMode="numeric" />
          <p>{errors.acNominalVoltage?.message}</p>

          <label htmlFor="acMaxCurrent">Corrente Máxima (A)*</label>
          <input {...register("acMaxCurrent")} id="acMaxCurrent" type="number" inputMode="numeric" />
          <p>{errors.acMaxCurrent?.message}</p>

          <label htmlFor="frequency">Frequência (Hz)</label>
          <input {...register("frequency")} id="frequency" type="number" inputMode="numeric" />
          <p>{errors.frequency?.message}</p>

          <label htmlFor="thd">THD (%)</label>
          <input {...register("thd")} id="thd" type="number" inputMode="numeric" step="any" />
          <p>{errors.thd?.message}</p>

          <p>Fator de Potência</p>
          <label htmlFor="powerFactor.i">Indutivo</label>
          <input
            {...register("powerFactor.i")}
            id="powerFactor.i"
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.powerFactor?.i?.message}</p>

          <label htmlFor="powerFactor.c">Capacitivo</label>
          <input
            {...register("powerFactor.c")}
            id="powerFactor.c"
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.powerFactor?.c?.message}</p>

          <label htmlFor="connectionType">Tipo de Conexão*</label>
          <select {...register("connectionType")} id="connectionType">
            <option value="single-phase">Monofásico</option>
            <option value="three-phase">Trifásico</option>
          </select>
          <p>{errors.connectionType?.message}</p>
        </fieldset>
        {/* Efficiency */}
        <fieldset>
          <legend>Eficiência</legend>
          <label htmlFor="efficiency.max">Máxima (%)</label>
          <input
            {...register("efficiency.max")}
            id="efficiency.max"
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.efficiency?.max?.message}</p>

          <label htmlFor="efficiency.european">Europeia (%)</label>
          <input
            {...register("efficiency.european")}
            id="efficiency.european"
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.efficiency?.european?.message}</p>
        </fieldset>
        {/* Mechanical Specifications */}
        <fieldset>
          <legend>Especificações Mecânicas</legend>
          <label htmlFor="dimensions.width">Largura (m)</label>
          <input
            {...register("dimensions.width")}
            id="dimensions.width"
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.dimensions?.width?.message}</p>

          <label htmlFor="dimensions.length">Comprimento (m)</label>
          <input
            {...register("dimensions.length")}
            id="dimensions.length"
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.dimensions?.length?.message}</p>

          <label htmlFor="dimensions.depth">Profundidade (m)</label>
          <input
            {...register("dimensions.depth")}
            id="dimensions.depth"
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.dimensions?.depth?.message}</p>

          <label htmlFor="weight">Peso (kg)</label>
          <input {...register("weight")} id="weight" type="number" inputMode="numeric" step="any" />
          <p>{errors.weight?.message}</p>

          <label htmlFor="protection">Grau de Proteção</label>
          <input {...register("protection")} id="protection" />
          <p>{errors.protection?.message}</p>

          <label htmlFor="connectors.dc">Conector CC</label>
          <input {...register("connectors.dc")} id="connectors.dc" />
          <p>{errors.connectors?.dc?.message}</p>

          <label htmlFor="connectors.ac">Conector CA</label>
          <input {...register("connectors.ac")} id="connectors.ac" />
          <p>{errors.connectors?.ac?.message}</p>
        </fieldset>
        {/* Datasheet / Image Upload */}
        {/* <label htmlFor="datasheetUrl">URL do Datasheet</label>
        <input type="file" {...register("datasheetUrl")} id="datasheetUrl" accept=".pdf" />
        <p>{errors.datasheetUrl?.message}</p> */}
        <button type="submit">Cadastrar</button>
      </form>
    </>
  );
};

export default InverterForm;
