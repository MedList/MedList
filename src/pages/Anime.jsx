import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../components/Navbar";

function Anime() {
  return (
    <>
      <Navbar />
      <h1>Anime</h1>
      <p>This is the about page.</p>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Anime />);
