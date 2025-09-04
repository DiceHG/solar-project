import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from "react-router";

const clientSchema = z.object({
  clientType: z.enum(["individual", "company"]),
  name: z.string(),
  docNumber: z.string(),
  email: z.email(),
  phoneNumber: z.string(),
  dateOfBirth: z.iso.date().optional(),
});

const ClientForm = ({ mode = "create", initialData = {} }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData,
  });
  const clientType = watch("clientType");

  const onSubmit = async (data) => {
    try {
      if (mode === "create") {
        await axios.post("http://localhost:5000/api/clients", data);
      } else {
        await axios.put(
          `http://localhost:5000/api/clients/${initialData._id}`,
          data
        );
      }
      navigate("/clients", { replace: true });
    } catch (err) {
      console.error(err?.response?.data || err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("clientType")}
        id="individual"
        type="radio"
        value="individual"
        defaultChecked
      />
      <label htmlFor="individual">Individual</label>
      <input
        {...register("clientType")}
        id="company"
        type="radio"
        value="company"
      />
      <label htmlFor="company">Company</label>
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

      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default ClientForm;
