
import React, { createContext } from "react";


export const context = createContext();


const StateManagement = ({ children }) => {
  const student = {
    name: "Manish Kumar",
    roll: 14800222021,
  };

  return (
    <context.Provider value={student}>
      {children}
    </context.Provider>
  );
};

export default StateManagement;
