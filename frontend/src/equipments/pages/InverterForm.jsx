import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const mpptSchema = z.object({
  startUpVoltage: z.coerce
    .number()
    .positive("Tensão de Partida deve ser positiva"),
  maxVoltage: z.coerce.number().positive("Tensão máxima deve ser positiva"),
  maxCurrent: z.coerce.number().positive("Corrente máxima deve ser positiva"),
  numOfStrings: z.coerce.number().int().default(1),
});

const inverterSchema = z.object({
  maker: z.string().min(1, "Maker is required"),
  model: z.string().min(1, "Model is required"),
  inmetro: z.string().min(1, "Inmetro is required"),
  // datasheetUrl: z.string().optional(),

  // Input DC
  inputPower: z.coerce
    .number()
    .positive("Potência de Entrada deve ser positiva"), // kW (DC)
  mpptConfig: z.array(mpptSchema).min(1, "No mínimo uma MPPT é necessária "),

  // Output AC
  outputPower: z.coerce.number().min(0, "Output Power is required"), // kW (AC)
  outputVoltage: z.coerce
    .number()
    .min(0, "Output Voltage is required")
    .default(220), // V (AC)
  outputCurrent: z.coerce.number().min(0, "Output Current is required"), // A (AC)
  phaseType: z.enum(["single-phase", "three-phase"]).default("single-phase"),
  frequency: z.coerce.number().min(0).default(60), // Hz
  efficiency: z.coerce.number().min(0).max(100).optional(), // %
});

const defaultMppt = () => ({
  startUpVoltage: "",
  maxVoltage: "",
  maxCurrent: "",
  numOfStrings: 1,
});

const InverterForm = ({ mode = "create" }) => {
  const [initialData, setInitialData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(inverterSchema),
    defaultValues: {
      maker: "",
      model: "",
      inmetro: "",
      inputPower: "",
      mpptConfig: [defaultMppt()],
      outputPower: "",
      outputVoltage: 220,
      outputCurrent: "",
      phaseType: "single-phase",
      frequency: 60,
      efficiency: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const res = await axios.get(
          `http://localhost:5000/api/inverters/${id}`
        );
        const inverter = res.data.data;
        reset({
          ...inverter,
        });
        setInitialData(inverter);
      })();
    }
  }, [mode, id, reset]);

  const onSubmit = async (data) => {
    try {
      if (mode === "create") {
        await axios.post("http://localhost:5000/api/inverters", data);
      } else if (mode === "edit") {
        await axios.put(
          `http://localhost:5000/api/inverters/${initialData._id}`,
          data
        );
      }
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
      <Link to="/equipments">Voltar</Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="model">Modelo</label>
        <input {...register("model")} id="model" />
        <p>{errors.model?.message}</p>

        <label htmlFor="maker">Fabricante</label>
        <input {...register("maker")} id="maker" />
        <p>{errors.maker?.message}</p>

        <label htmlFor="inmetro">Tipo de Documento</label>
        <input {...register("inmetro")} id="inmetro" />
        <p>{errors.inmetro?.message}</p>

        <label htmlFor="inputPower">Potência de Entrada</label>
        <input
          type="number"
          {...register("inputPower")}
          id="inputPower"
          inputMode="numeric"
        />
        <p>{errors.inputPower?.message}</p>

        {fields.map((f, i) => (
          <fieldset key={f.id}>
            <legend>MPPT {i + 1}</legend>

            <button
              type="button"
              onClick={() => remove(i)}
              hidden={fields.length === 1}
            >
              Remover
            </button>

            <label htmlFor={`mpptConfig.${i}.startUpVoltage`}>
              Tensão de Partida (V)
            </label>
            <input
              id={`mpptConfig.${i}.startUpVoltage`}
              type="number"
              inputMode="numeric"
              {...register(`mpptConfig.${i}.startUpVoltage`)}
            />
            <p>{errors.mpptConfig?.[i]?.startUpVoltage?.message}</p>

            <label htmlFor={`mpptConfig.${i}.maxVoltage`}>
              Tensão Máxima (V)
            </label>
            <input
              id={`mpptConfig.${i}.maxVoltage`}
              type="number"
              inputMode="numeric"
              {...register(`mpptConfig.${i}.maxVoltage`)}
            />
            <p>{errors.mpptConfig?.[i]?.maxVoltage?.message}</p>

            <label htmlFor={`mpptConfig.${i}.maxCurrent`}>
              Corrente Máxima (A)
            </label>
            <input
              id={`mpptConfig.${i}.maxCurrent`}
              type="number"
              inputMode="numeric"
              {...register(`mpptConfig.${i}.maxCurrent`)}
            />
            <p>{errors.mpptConfig?.[i]?.maxCurrent?.message}</p>

            <label htmlFor={`mpptConfig.${i}.numOfStrings`}>
              Número de Strings
            </label>
            <input
              id={`mpptConfig.${i}.numOfStrings`}
              type="number"
              inputMode="numeric"
              {...register(`mpptConfig.${i}.numOfStrings`)}
            />
            <p>{errors.mpptConfig?.[i]?.numOfStrings?.message}</p>
          </fieldset>
        ))}

        <button type="button" onClick={() => append(defaultMppt())}>
          + Adicionar MPPT
        </button>

        <label htmlFor="outputPower">Potência de Saída</label>
        <input
          type="number"
          {...register("outputPower")}
          id="outputPower"
          inputMode="numeric"
        />
        <p>{errors.outputPower?.message}</p>

        <label htmlFor="outputVoltage">Tensão de Saída</label>
        <input
          type="number"
          {...register("outputVoltage")}
          id="outputVoltage"
          inputMode="numeric"
        />
        <p>{errors.outputVoltage?.message}</p>

        <label htmlFor="outputCurrent">Corrente de Saída</label>
        <input
          type="number"
          {...register("outputCurrent")}
          id="outputCurrent"
          inputMode="numeric"
        />
        <p>{errors.outputCurrent?.message}</p>

        <label htmlFor="phaseType">Tipo de Fase</label>
        <select {...register("phaseType")} id="phaseType">
          <option value="single-phase">Monofásico</option>
          <option value="three-phase">Trifásico</option>
        </select>
        <p>{errors.phaseType?.message}</p>

        <label htmlFor="frequency">Frequência (Hz)</label>
        <input
          type="number"
          {...register("frequency")}
          id="frequency"
          inputMode="numeric"
        />
        <p>{errors.frequency?.message}</p>

        <label htmlFor="efficiency">Eficiência (%)</label>
        <input
          type="number"
          {...register("efficiency")}
          id="efficiency"
          inputMode="numeric"
        />
        <p>{errors.efficiency?.message}</p>

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

export default InverterForm;
