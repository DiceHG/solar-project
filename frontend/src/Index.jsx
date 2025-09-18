import React from "react";
import { Link } from "react-router";

const Index = () => {
  return (
    <div>
      <Link to="/clients">
        <button>Clients</button>
      </Link>
      <br />
      <Link to="/equipments">
        <button>Equipments</button>
      </Link>
    </div>
  );
};

export default Index;
