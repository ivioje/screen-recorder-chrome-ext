import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContextProvider } from "./Context";
import { BrowserRouter as Router } from "react-router-dom";

const root = document.createElement("div");
root.className = "container";

document.body.appendChild(root);
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
	<React.StrictMode>
		<Router>
			<ContextProvider>
				<App />
			</ContextProvider>
		</Router>
	</React.StrictMode>
);

// ReactDOM.createRoot(document.getElementById("root")).render(
// 	<React.StrictMode>
// 		<App />
// 	</React.StrictMode>
// );
