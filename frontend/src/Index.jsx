import React from "react";
import { Link } from "react-router";

const Index = () => {
  return (
    <div>
      <Link to="/clients">Clients</Link>
      <br />
      <Link to="/equipments/inverters/form">Inverter</Link>
    </div>
  );
};

export default Index;
