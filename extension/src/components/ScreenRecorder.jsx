import React, { useContext, useState } from "react";
import { Context } from "../Context";
import icon48 from "../assets/images/icon48.png";
import settings from "../assets/images/setting-2.png";
import close from "../assets/images/close-circle.png";
import fullscreen from "../assets/images/monitor.png";
import camera from "../assets/images/video-camera.png";
import mic from "../assets/images/microphone.png";
import tab from "../assets/images/copytab.png";

export default function ScreenRecording({ handleClosePopup }) {
	const { status, startRecording } = useContext(Context);

	return (
		<main className="container">
			<div className="container_header">
				<div className="container_header_logo">
					<img
						src={icon48}
						alt="logo"
					/>
					<h1>HelpMeOut</h1>
				</div>
				<div className="container_header_icons">
					<img
						src={settings}
						alt="settings"
					/>
					<img
						src={close}
						alt="close"
						onClick={handleClosePopup}
					/>
				</div>
			</div>
			<p className="container_p">
				This extension helps you record and share help videos with ease.
			</p>

			<div className="container_record-options">
				<div
					className="container_record-options_full"
					id="start_fullscreen_recording"
				>
					<img
						src={fullscreen}
						alt="fullscreen"
					/>
					<span>Full screen</span>
				</div>
				<div
					className="container_record-options_tab"
					id="start_currentTab_recording"
				>
					<img
						src={tab}
						alt="currenttab"
					/>
					<span>Current Tab</span>
				</div>
			</div>

			<div className="container_permission">
				<div className="container_permission_camera">
					<span>
						<img
							src={camera}
							alt="camera"
						/>
						Camera
					</span>
					<div>
						{/*rounded switch */}
						<input
							type="checkbox"
							id="switch1"
							className="checkbox1"
						/>

						<label
							htmlFor="switch1"
							className="toggle1"
						></label>
					</div>
				</div>
				<div className="container_permission_mic">
					<span>
						<img
							src={mic}
							alt="mic"
						/>
						Audio
					</span>
					<div>
						{/*rounded switch */}
						<input
							type="checkbox"
							id="switch2"
							className="checkbox2"
						/>

						<label
							htmlFor="switch2"
							className="toggle2"
						></label>
					</div>
				</div>
			</div>

			{status !== "recording" && (
				<div
					className="container_button"
					onClick={() => {
						startRecording();
					}}
				>
					<button id="startRecording">Start Recording</button>
				</div>
			)}
		</main>
	);
}
