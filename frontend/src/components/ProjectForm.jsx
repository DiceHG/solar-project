import React, { useState } from "react";

const ProjectForm = ({ onClose, onSubmit }) => {
  const [projectTitle, setProjectTitle] = useState("");

  const handleChange = (e) => {
    setProjectTitle(e.target.value);
  };

  return (
    <div>
      <button onClick={onClose}>X</button>
      <label htmlFor="projectTitle">Título do Projeto</label>
      <input type="text" id="projectTitle" value={projectTitle} onChange={handleChange} />
      <button onClick={() => onSubmit(projectTitle)}>Adicionar</button>
    </div>
  );
};

export default ProjectForm;
