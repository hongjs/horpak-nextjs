import React from "react";
import { CircularProgress } from "@mui/material";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <CircularProgress color="primary" />
    </div>
  );
};

export default Loader;
