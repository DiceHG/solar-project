import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const moduleSchema = z.object({
  maker: z.string().min(1),
  model: z.string().min(1),
  inmetro: z.string().min(1),
  // datasheetUrl: z.string().optional(),

  // Dimensions
  width: z.coerce.number().positive(), // m
  length: z.coerce.number().positive(), // m

  // Output
  maxPower: z.coerce.number().min(0), // W
  maxVoltage: z.coerce.number().min(0), // V
  maxCurrent: z.coerce.number().min(0), // A
});

const ModuleForm = ({ mode = "create" }) => {
  const [initialData, setInitialData] = useState({});
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
        res = await axios.put(
          `http://localhost:5000/api/modules/${initialData._id}`,
          data
        );
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
        <label htmlFor="model">Modelo</label>
        <input {...register("model")} id="model" />
        <p>{errors.model?.message}</p>

        <label htmlFor="maker">Fabricante</label>
        <input {...register("maker")} id="maker" />
        <p>{errors.maker?.message}</p>

        <label htmlFor="inmetro">Inmetro</label>
        <input {...register("inmetro")} id="inmetro" />
        <p>{errors.inmetro?.message}</p>

        <label htmlFor="width">Largura</label>
        <input
          id="width"
          type="number"
          inputMode="numeric"
          step="any"
          {...register("width")}
        />
        <p>{errors.maxInputPower?.message}</p>

        <label htmlFor={`length`}>Comprimento</label>
        <input
          id={`length`}
          type="number"
          inputMode="numeric"
          step="any"
          {...register(`length`)}
        />
        <p>{errors.length?.message}</p>

        <label htmlFor={`maxPower`}>Potência (W)</label>
        <input
          id={`maxPower`}
          type="number"
          inputMode="numeric"
          {...register(`maxPower`)}
        />
        <p>{errors.maxPower?.message}</p>

        <label htmlFor="maxVoltage">Tensão (V)</label>
        <input
          type="number"
          {...register("maxVoltage")}
          id="maxVoltage"
          inputMode="numeric"
        />
        <p>{errors.maxVoltage?.message}</p>

        <label htmlFor="maxCurrent">Corrente (A)</label>
        <input
          type="number"
          {...register("maxCurrent")}
          id="maxCurrent"
          inputMode="numeric"
        />
        <p>{errors.maxCurrent?.message}</p>

        <label htmlFor="datasheetUrl">URL do Datasheet</label>
        <input
          type="file"
          {...register("datasheetUrl")}
          id="datasheetUrl"
          accept=".pdf"
        />
        <p>{errors.datasheetUrl?.message}</p>

        <button type="submit">Cadastrar</button>
      </form>
    </>
  );
};

export default ModuleForm;
