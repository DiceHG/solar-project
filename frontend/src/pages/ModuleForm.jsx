import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { moduleSchema } from "../schemas/module.schema";

const ModuleForm = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(moduleSchema),
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const res = await axios.get(`http://localhost:5000/api/modules/${id}`);
        const inverter = res.data.data;
        reset({
          ...inverter,
        });
        setInitialData(inverter);
      })();
    }
  }, [mode, id, reset]);

  const onSubmit = async (data) => {
    let res;
    try {
      if (mode === "create") {
        res = await axios.post("http://localhost:5000/api/modules", data);
      } else if (mode === "edit") {
        res = await axios.put(`http://localhost:5000/api/modules/${id}`, data);
      }
      console.log(res.data);
      navigate(`/equipments`, { replace: true });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <>
      <h1>{mode === "create" ? "Cadastrar Módulo" : "Editar Módulo"}</h1>
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

          <label htmlFor="warrantyYears">Garantia</label>
          <input {...register("warrantyYears")} id="warrantyYears" />
          <p>{errors.warrantyYears?.message}</p>

          <label htmlFor="price">Preço*</label>
          <input {...register("price")} id="price" type="number" inputMode="numeric" step="any" />
          <p>{errors.price?.message}</p>
        </fieldset>

        {/* Mechanical Specifications */}
        <fieldset>
          <legend>Especificações Mecânicas</legend>
          <label htmlFor="width">Largura</label>
          <input {...register("dimensions.width")} id="width" type="number" inputMode="numeric" step="any" />
          <p>{errors.dimensions?.width?.message}</p>

          <label htmlFor={`length`}>Comprimento</label>
          <input
            {...register(`dimensions.length`)}
            id={`length`}
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.dimensions?.length?.message}</p>

          <label htmlFor={`depth`}>Profundidade</label>
          <input
            {...register(`dimensions.depth`)}
            id={`depth`}
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.dimensions?.depth?.message}</p>

          <label htmlFor={`weight`}>Peso</label>
          <input {...register(`weight`)} id={`weight`} type="number" inputMode="numeric" step="any" />
          <p>{errors.weight?.message}</p>

          <label htmlFor={`cellType`}>Tipo de Célula</label>
          <input {...register(`cellType`)} id={`cellType`} />
          <p>{errors.cellType?.message}</p>

          <label htmlFor={`numOfCells`}>Número de Células</label>
          <input {...register(`numOfCells`)} id={`numOfCells`} type="number" inputMode="numeric" />
          <p>{errors.numOfCells?.message}</p>

          <label htmlFor={`frame`}>Estrutura</label>
          <input {...register(`frame`)} id={`frame`} />
          <p>{errors.frame?.message}</p>

          <label htmlFor={`junctionBox`}>Junction Box</label>
          <input {...register(`junctionBox`)} id={`junctionBox`} />
          <p>{errors.junctionBox?.message}</p>

          <label htmlFor={`cable`}>Cabo</label>
          <input {...register(`cable`)} id={`cable`} />
          <p>{errors.cable?.message}</p>

          <label htmlFor={`connector`}>Conector</label>
          <input {...register(`connector`)} id={`connector`} />
          <p>{errors.connector?.message}</p>
        </fieldset>

        {/* Eletrical Specifications */}
        <fieldset>
          <legend>Especificações Elétricas</legend>
          <label htmlFor={`maxPower`}>Potência (W)*</label>
          <input {...register(`maxPower`)} id={`maxPower`} type="number" inputMode="numeric" step="any" />
          <p>{errors.maxPower?.message}</p>

          <label htmlFor="maxPowerVoltage">Tensão (V)*</label>
          <input
            {...register("maxPowerVoltage")}
            id="maxPowerVoltage"
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.maxPowerVoltage?.message}</p>

          <label htmlFor="maxPowerCurrent">Corrente (A)*</label>
          <input
            {...register("maxPowerCurrent")}
            id="maxPowerCurrent"
            type="number"
            inputMode="numeric"
            step="any"
          />
          <p>{errors.maxPowerCurrent?.message}</p>

          <label htmlFor="ocVoltage">Tensão de Circuito Aberto (V)</label>
          <input {...register("ocVoltage")} id="ocVoltage" type="number" inputMode="numeric" step="any" />
          <p>{errors.ocVoltage?.message}</p>

          <label htmlFor="scCurrent">Corrente de Curto Circuito (A)</label>
          <input {...register("scCurrent")} id="scCurrent" type="number" inputMode="numeric" step="any" />
          <p>{errors.scCurrent?.message}</p>

          <label htmlFor="efficiency">Eficiência</label>
          <input {...register("efficiency")} id="efficiency" type="number" inputMode="numeric" step="any" />
          <p>{errors.efficiency?.message}</p>

          <label htmlFor="maxSystemVoltage">Tensão Máxima do Sistema (VDC)</label>
          <input {...register("maxSystemVoltage")} id="maxSystemVoltage" type="number" inputMode="numeric" />
          <p>{errors.maxSystemVoltage?.message}</p>

          <label htmlFor="maxSeriesFuse">Classificação máxima do fusível em série (A)</label>
          <input {...register("maxSeriesFuse")} id="maxSeriesFuse" type="number" inputMode="numeric" />
          <p>{errors.maxSeriesFuse?.message}</p>
        </fieldset>

        {/* <label htmlFor="datasheetUrl">URL do Datasheet</label>
        <input {...register("datasheetUrl")} type="file" id="datasheetUrl" accept=".pdf" />
        <p>{errors.datasheetUrl?.message}</p> */}

        <button type="submit">Cadastrar</button>
      </form>
    </>
  );
};

export default ModuleForm;
