import React from "react";
import { useState } from "react";
import axios from "axios";

const ProjectForm = ({ client }) => {
  const [title, setTitle] = useState("");

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSend = async (data) => {
    try {
      await axios
        .post(`http://localhost:5000/api/projects/`, data)
        .then((res) => console.log(res.data));
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div>
      <label htmlFor="title">Título</label>
      <input type="text" value={title} onChange={handleChange} />

      <button onClick={() => handleSend({ client, title })}>Criar</button>
    </div>
  );
};

export default ProjectForm;
