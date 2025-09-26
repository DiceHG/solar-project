import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSchema } from "../schemas/site.schema.js";
import axios from "axios";

const SiteForm = ({ mode = "create", id, projectId }) => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(siteSchema),
    defaultValues: { project: projectId },
  });

  useEffect(() => {
    if (mode === "edit") {
      const fetchSite = async () => {
        const res = await axios.get(`http://localhost:5000/api/sites/${id}`);
        reset({ ...res.data.data });
      };
      fetchSite();
    }
  }, [mode, id, reset]);

  const fetchViaCep = async () => {
    const cep = getValues("address.cep");
    const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (res.data.erro) return;
    const { uf, localidade, bairro, logradouro, complemento } = res.data;
    reset((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        cep,
        state: uf,
        city: localidade,
        district: bairro,
        street: logradouro,
        complement: complemento,
      },
    }));
  };

  const onSubmit = async (data) => {
    try {
      let res;
      if (mode === "create") {
        res = await axios.post("http://localhost:5000/api/sites", { ...data, project: projectId });
      } else if (mode === "edit") {
        res = await axios.put(`http://localhost:5000/api/sites/${id}`, { ...data, project: projectId });
      }
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <>
      <h1>{mode === "create" ? "Cadastrar Local" : "Editar Local"}</h1>

      <button>Voltar</button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Nome</label>
        <input {...register("name")} id="name" />
        <p>{errors.name?.message}</p>

        {/* Address */}
        <fieldset>
          <label htmlFor="address.cep">CEP</label>
          <input {...register("address.cep")} id="address.cep" />
          <p>{errors.address?.cep?.message}</p>

          <button type="button" onClick={fetchViaCep}>
            Placeholder
          </button>
          <br />

          <label htmlFor="address.state">Estado</label>
          <input {...register("address.state")} id="address.state" />
          <p>{errors.address?.state?.message}</p>

          <label htmlFor="address.city">Cidade</label>
          <input {...register("address.city")} id="address.city" />
          <p>{errors.address?.city?.message}</p>

          <label htmlFor="address.district">Bairro</label>
          <input {...register("address.district")} id="address.district" />
          <p>{errors.address?.district?.message}</p>

          <label htmlFor="address.street">Logradouro</label>
          <input {...register("address.street")} id="address.street" />
          <p>{errors.address?.street?.message}</p>

          <label htmlFor="address.number">Número</label>
          <input {...register("address.number")} id="address.number" />
          <p>{errors.address?.number?.message}</p>

          <label htmlFor="address.complement">Complemento</label>
          <input {...register("address.complement")} id="address.complement" />
          <p>{errors.address?.complement?.message}</p>
        </fieldset>

        <fieldset>
          <label htmlFor="utilityCompany">Concessionária</label>
          <input {...register("utilityCompany")} id="utilityCompany" />
          <p>{errors.utilityCompany?.message}</p>

          <label htmlFor="uc">UC</label>
          <input {...register("uc")} id="uc" />
          <p>{errors.uc?.message}</p>

          <label htmlFor="accountHolder">Titular</label>
          <input {...register("accountHolder")} id="accountHolder" />
          <p>{errors.accountHolder?.message}</p>

          <label htmlFor="serviceType.class">Classe</label>
          <select {...register("serviceType.class")} id="serviceType.class">
            <option value="">Selecionar</option>
            <option value="residential">Residencial</option>
            <option value="commercial">Comercial</option>
            <option value="industrial">Industrial</option>
          </select>
          <p>{errors.serviceType?.class?.message}</p>

          <label htmlFor="serviceType.connection">Ligação</label>
          <select {...register("serviceType.connection")} id="serviceType.connection">
            <option value="">Selecionar</option>
            <option value="single-phase">Monofásica</option>
            <option value="two-phase">Bifásica</option>
            <option value="three-phase">Trifásica</option>
          </select>
          <p>{errors.serviceType?.connection?.message}</p>

          <label htmlFor="serviceType.voltage">Tensão</label>
          <input {...register("serviceType.voltage")} id="serviceType.voltage" />
          <p>{errors.serviceType?.voltage?.message}</p>

          <label htmlFor="serviceType.circuitBreaker">Disjuntor</label>
          <input {...register("serviceType.circuitBreaker")} id="serviceType.circuitBreaker" />
          <p>{errors.serviceType?.circuitBreaker?.message}</p>

          <p>{errors.serviceType?.class?.message}</p>
        </fieldset>

        <fieldset>
          <label htmlFor="coords.lat">Latitude</label>
          <input {...register("coords.lat")} id="coords.lat" />
          <p>{errors.coords?.lat?.message}</p>

          <label htmlFor="coords.lng">Longitude</label>
          <input {...register("coords.lng")} id="coords.lng" />
          <p>{errors.coords?.lng?.message}</p>
        </fieldset>

        <fieldset>
          <label>Consumo (kW)</label>
          <ul>
            {Array.from({ length: 12 }).map((_, i) => (
              <input
                key={i}
                {...register(`consumption[${i}]`, { setValueAs: (v) => v?.trim() || undefined })}
                id={`consumption[${i}]`}
              />
            ))}
          </ul>
        </fieldset>

        <button type="submit" onClick={() => console.log(getValues(), errors)}>
          Enviar
        </button>
      </form>
    </>
  );
};

export default SiteForm;
