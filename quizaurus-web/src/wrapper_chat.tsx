import { createRoot } from "react-dom/client";
import App from "./component";
import React, { useState } from "react";

createRoot(document.getElementById("quizaurus-root")!).render(<App />);

export default App;
