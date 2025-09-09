import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { isValidCPF, isValidCNPJ } from "../../shared/utils/br-docs";

const clientSchema = z
  .object({
    clientType: z.enum(["individual", "company"]),
    name: z.string().min(1),
    docNumber: z.string(),
    email: z.email(),
    phoneNumber: z.string().min(10).max(15),
    dateOfBirth: z.iso.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.clientType === "individual" && !isValidCPF(data.docNumber)) {
      ctx.addIssue({
        code: "custom",
        path: ["docNumber"],
        message: "Invalid CPF",
      });
    }

    if (data.clientType === "company" && !isValidCNPJ(data.docNumber)) {
      ctx.addIssue({
        code: "custom",
        path: ["docNumber"],
        message: "Invalid CNPJ",
      });
    }
  });

const ClientForm = ({ mode = "create" }) => {
  const [initialData, setInitialData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: { clientType: "individual" },
  });
  const clientType = watch("clientType");

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const res = await axios.get(`http://localhost:5000/api/clients/${id}`);
        const client = res.data.data;
        setInitialData(client);
        reset({
          ...client,
          dateOfBirth: client.dateOfBirth
            ? client.dateOfBirth.split("T")[0]
            : "",
        });
      })();
    }
  }, [mode, id, reset]);

  const onSubmit = async (data) => {
    try {
      if (mode === "create") {
        await axios.post("http://localhost:5000/api/clients", data);
        navigate("/clients", { replace: true });
      } else if (mode === "edit") {
        await axios.put(
          `http://localhost:5000/api/clients/${initialData._id}`,
          data
        );
        navigate(`/clients/${initialData._id}`, { replace: true });
      }
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <>
      <h1>{mode === "create" ? "Cadastrar Cliente" : "Editar Cliente"}</h1>
      <Link to="/clients">
        <button>Voltar</button>
      </Link>
      <p>Tipo Cliente</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("clientType")}
          id="individual"
          type="radio"
          value="individual"
        />
        <label htmlFor="individual">Física</label>
        <input
          {...register("clientType")}
          id="company"
          type="radio"
          value="company"
        />
        <label htmlFor="company">Jurídica</label>
        <p>{errors.clientType?.message}</p>

        <label htmlFor="name">
          {clientType === "individual" ? "Nome" : "Razão Social"}
        </label>
        <input {...register("name")} id="name" />
        <p>{errors.name?.message}</p>

        <label htmlFor="docNumber">
          {clientType === "individual" ? "CPF" : "CNPJ"}
        </label>
        <input {...register("docNumber")} id="docNumber" />
        <p>{errors.docNumber?.message}</p>

        <label htmlFor="email">Email</label>
        <input {...register("email")} id="email" />
        <p>{errors.email?.message}</p>

        <label htmlFor="phoneNumber">Telefone</label>
        <input {...register("phoneNumber")} id="phoneNumber" />
        <p>{errors.phoneNumber?.message}</p>

        <label htmlFor="dateOfBirth">
          {clientType === "individual"
            ? "Data de Nascimento"
            : "Data de Abertura"}
        </label>
        <input {...register("dateOfBirth")} type="date" id="dateOfBirth" />
        <p>{errors.dateOfBirth?.message}</p>

        <button type="submit">Enviar</button>
      </form>
    </>
  );
};

export default ClientForm;
