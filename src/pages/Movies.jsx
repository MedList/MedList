import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../components/Navbar";

function Movies() {
  return (
    <>
      <Navbar />
      <h1>Movies</h1>
      <p>Email us at hello@example.com</p>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Movies />);
