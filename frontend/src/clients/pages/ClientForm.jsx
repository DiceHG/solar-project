import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "../../shared/schemas/client.schema.js";
import axios from "axios";

const ClientForm = ({ mode = "create" }) => {
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
    defaultValues: { entityType: "individual" },
  });
  const entityType = watch("entityType");

  useEffect(() => {
    if (mode === "edit" && id) {
      (async () => {
        const res = await axios.get(`http://localhost:5000/api/clients/${id}`);
        const client = res.data.data;
        reset({
          ...client,
          originDate: client.originDate ? client.originDate.split("T")[0] : "",
        });
      })();
    }
  }, [mode, id, reset]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (mode === "create") {
        res = await axios.post("http://localhost:5000/api/clients", data);
        navigate("/clients", { replace: true });
      } else if (mode === "edit") {
        res = await axios.put(`http://localhost:5000/api/clients/${id}`, data);
        navigate(`/clients/${id}`, { replace: true });
      }
      console.log(res);
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
        <input {...register("entityType")} id="individual" type="radio" value="individual" />
        <label htmlFor="individual">Física</label>
        <input {...register("entityType")} id="company" type="radio" value="company" />
        <label htmlFor="company">Jurídica</label>
        <p>{errors.entityType?.message}</p>

        <label htmlFor="name">{entityType === "individual" ? "Nome" : "Razão Social"}</label>
        <input {...register("name")} id="name" />
        <p>{errors.name?.message}</p>

        <label htmlFor="docNumber">{entityType === "individual" ? "CPF" : "CNPJ"}</label>
        <input {...register("docNumber")} id="docNumber" />
        <p>{errors.docNumber?.message}</p>

        <label htmlFor="email">Email</label>
        <input {...register("email")} id="email" />
        <p>{errors.email?.message}</p>

        <label htmlFor="phoneNumber">Telefone</label>
        <input {...register("phoneNumber")} id="phoneNumber" />
        <p>{errors.phoneNumber?.message}</p>

        <label htmlFor="originDate">
          {entityType === "individual" ? "Data de Nascimento" : "Data de Abertura"}
        </label>
        <input {...register("originDate")} type="date" id="originDate" />
        <p>{errors.originDate?.message}</p>

        <button type="submit">Enviar</button>
      </form>
    </>
  );
};

export default ClientForm;
