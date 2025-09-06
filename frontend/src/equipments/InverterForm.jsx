import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const mpptSchema = z.object({
  startUpVoltage: z.coerce.number().positive(),
  inputVoltage: z.object({
    min: z.coerce.number().positive(),
    max: z.coerce.number().positive(),
  }),
  maxInputCurrent: z.coerce.number().positive(),
  numOfStrings: z.coerce.number().int().default(1),
});

const inverterSchema = z.object({
  maker: z.string().min(1),
  model: z.string().min(1),
  inmetro: z.string().min(1),
  // datasheetUrl: z.string().optional(),

  // Input DC
  maxInputPower: z.coerce.number().positive(), // kW (DC)
  mpptConfig: z.array(mpptSchema).min(1),

  // Output AC
  maxOutputPower: z.coerce.number().min(0), // kW (AC)
  maxOutputVoltage: z.coerce.number().min(0).default(220), // V (AC)
  maxOutputCurrent: z.coerce.number().min(0), // A (AC)
  phaseType: z.enum(["single-phase", "three-phase"]).default("single-phase"),
  frequency: z.coerce.number().min(0).default(60), // Hz
  efficiency: z.coerce.number().min(0).max(100).optional(), // %
});

const defaultMppt = () => ({
  startUpVoltage: "",
  inputVoltage: {
    min: "",
    max: "",
  },
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inverterSchema),
    defaultValues: {
      maker: "",
      model: "",
      inmetro: "",
      maxInputPower: "",
      mpptConfig: [defaultMppt()],
      maxOutputPower: "",
      maxOutputVoltage: 220,
      maxOutputCurrent: "",
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
        console.log(data);
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

        <label htmlFor="inmetro">Inmetro</label>
        <input {...register("inmetro")} id="inmetro" />
        <p>{errors.inmetro?.message}</p>

        <label htmlFor="maxInputPower">Máxima Potência de Entrada</label>
        <input
          type="number"
          {...register("maxInputPower")}
          id="maxInputPower"
          inputMode="numeric"
        />
        <p>{errors.maxInputPower?.message}</p>

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

            <label htmlFor={`mpptConfig.${i}.inputVoltage.min`}>
              Tensão Mínima (V)
            </label>
            <input
              id={`mpptConfig.${i}.inputVoltage.min`}
              type="number"
              inputMode="numeric"
              {...register(`mpptConfig.${i}.inputVoltage.min`)}
            />
            <p>{errors.mpptConfig?.[i]?.inputVoltage?.min?.message}</p>

            <label htmlFor={`mpptConfig.${i}.inputVoltage.max`}>
              Tensão Máxima (V)
            </label>
            <input
              id={`mpptConfig.${i}.inputVoltage.max`}
              type="number"
              inputMode="numeric"
              {...register(`mpptConfig.${i}.inputVoltage.max`)}
            />
            <p>{errors.mpptConfig?.[i]?.inputVoltage?.max?.message}</p>

            <label htmlFor={`mpptConfig.${i}.maxInputCurrent`}>
              Corrente Máxima (A)
            </label>
            <input
              id={`mpptConfig.${i}.maxInputCurrent`}
              type="number"
              inputMode="numeric"
              {...register(`mpptConfig.${i}.maxInputCurrent`)}
            />
            <p>{errors.mpptConfig?.[i]?.maxInputCurrent?.message}</p>

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

        <label htmlFor="maxOutputPower">Máxima Potência de Saída</label>
        <input
          type="number"
          {...register("maxOutputPower")}
          id="maxOutputPower"
          inputMode="numeric"
        />
        <p>{errors.maxOutputPower?.message}</p>

        <label htmlFor="maxOutputVoltage">Máxima Tensão de Saída</label>
        <input
          type="number"
          {...register("maxOutputVoltage")}
          id="maxOutputVoltage"
          inputMode="numeric"
        />
        <p>{errors.maxOutputVoltage?.message}</p>

        <label htmlFor="maxOutputCurrent">Máxima Corrente de Saída</label>
        <input
          type="number"
          {...register("maxOutputCurrent")}
          id="maxOutputCurrent"
          inputMode="numeric"
        />
        <p>{errors.maxOutputCurrent?.message}</p>

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
