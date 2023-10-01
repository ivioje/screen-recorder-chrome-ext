import React, { useContext } from "react";
import { Context } from "../Context";

const Widget = () => {
	const { status, stopRecording, pauseRecording, resumeRecording } =
		useContext(Context);

	return (
		<div id="">
			{status === "recording" && (
				<div className="widget">
					<button
						type="button"
						onClick={stopRecording}
					>
						Stop
					</button>
					<button
						type="button"
						onClick={pauseRecording}
					>
						Pause screen recording
					</button>
					<button
						type="button"
						onClick={resumeRecording}
					>
						Resume screen recording
					</button>
				</div>
			)}
		</div>
	);
};

export default Widget;
