import { useContext, useState } from "react";
import { Context } from "./Context";

import ScreenRecording from "./components/ScreenRecorder";
import Widget from "./components/Widget";
import Preview from "./components/Preview";

function App() {
	const { status } = useContext(Context);
	const [closePopup, setClosePopup] = useState(true);

	const handleClosePopup = () => {
		setClosePopup(!closePopup);
	};

	document.addEventListener("DOMContentLoaded", function () {
		// Adjust the vertical position by changing the window.innerHeight value
		const popup = document.getElementById("popup-container");
		const verticalOffset = 100; // Adjust this value as needed

		console.log(window.innerHeight - verticalOffset, popup);

		// popup.style.height = `${window.innerHeight - verticalOffset}px`;
	});

	return (
		<div>
			{status !== "recording" ? (
				<>
					{closePopup && (
						<div className="app">
							<dialog
								className="dialog"
								open={status === "acquiring_media"}
								id="dialog"
							>
								Waiting for screen recording authorization
							</dialog>

							<div
								style={{
									width: `${status === "acquiring_media" ? "610px" : "300px"}`,
									height: `${status === "acquiring_media" ? "500px" : "439px"}`,
								}}
							>
								<ScreenRecording handleClosePopup={handleClosePopup} />
							</div>
						</div>
					)}
				</>
			) : (
				<div
					className="widget"
					id=""
				>
					<Widget />
				</div>
			)}

			<div id="video"></div>

			{/**Video file to be displayed after recording */}
			{/* <Preview /> */}
		</div>
	);
}

export default App;
