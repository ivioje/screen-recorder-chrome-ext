import React, { createContext, useRef, useState, useEffect } from "react";

export const Context = preserveRef("c", createContext());

function preserveRef(key, v) {
	if (import.meta.env.PROD) return v;

	const old = import.meta.hot.data[key];
	const now = old || v;

	import.meta.hot.on("vite:beforeUpdate", () => {
		import.meta.hot.data[key] = now;
	});

	return now;
}

export const ContextProvider = ({ children }) => {
	function isObject(o) {
		return o && !Array.isArray(o) && Object(o) === o;
	}

	function validateMediaTrackConstraints(mediaType) {
		let supportedMediaConstraints =
			navigator.mediaDevices.getSupportedConstraints();
		let unSupportedMediaConstraints = Object.keys(mediaType).filter(
			(constraint) => !supportedMediaConstraints[constraint]
		);

		if (unSupportedMediaConstraints.length !== 0) {
			let toText = unSupportedMediaConstraints.join(",");
			console.error(
				`The following constraints ${toText} are not supported on this browser.`
			);
		}
	}

	const noop = () => {};

	function useMediaRecorder({
		blobOptions,
		recordScreen,
		onStop = noop,
		onStart = noop,
		onError = noop,
		onDataAvailable = noop,
		mediaRecorderOptions,
		mediaStreamConstraints = {},
	}) {
		let mediaChunks = useRef([]);
		let mediaStream = useRef(null);
		let mediaRecorder = useRef(null);
		let [error, setError] = useState(null);
		let [status, setStatus] = useState("idle");
		let [mediaBlob, setMediaBlob] = useState(null);

		/** Get media stream */
		async function getMediaStream() {
			if (error) {
				setError(null);
			}

			setStatus("acquiring_media");

			try {
				let stream;

				if (recordScreen) {
					stream = await window.navigator.mediaDevices.getDisplayMedia(
						mediaStreamConstraints
					);
				} else {
					stream = await window.navigator.mediaDevices.getUserMedia(
						mediaStreamConstraints
					);
				}

				mediaStream.current = stream;
				//log stream id
				console.log(stream.id);
				setStatus("ready");
			} catch (err) {
				setError(err);
				setStatus("failed");
			}
		}

		/** Uninstall screen recording */
		function clearMediaStream() {
			if (mediaRecorder.current) {
				mediaRecorder.current.removeEventListener(
					"dataavailable",
					handleDataAvailable
				);
				mediaRecorder.current.removeEventListener("stop", handleStop);
				mediaRecorder.current.removeEventListener("error", handleError);
				mediaRecorder.current = null;
			}

			if (mediaStream.current) {
				mediaStream.current.getTracks().forEach((track) => track.stop());
				mediaStream.current = null;
				mediaChunks.current = [];
			}
		}

		/** Start recording */
		async function startRecording() {
			if (error) {
				setError(null);
			}

			if (!mediaStream.current) {
				await getMediaStream();
			}

			mediaChunks.current = [];

			if (mediaStream.current) {
				mediaRecorder.current = new MediaRecorder(
					mediaStream.current,
					mediaRecorderOptions
				);
				mediaRecorder.current.addEventListener(
					"dataavailable",
					handleDataAvailable
				);
				mediaRecorder.current.addEventListener("stop", handleStop);
				mediaRecorder.current.addEventListener("error", handleError);
				mediaRecorder.current.start();
				setStatus("recording");
				onStart();
				console.log("started");
			}
		}

		/** mediaRecorder dataavailable Callback */
		function handleDataAvailable(e) {
			if (e.data.size) {
				mediaChunks.current.push(e.data);
			}
			onDataAvailable(e.data);
		}

		/** stop Callback */
		function handleStop() {
			let [sampleChunk] = mediaChunks.current;
			let blobPropertyBag = Object.assign(
				{ type: sampleChunk.type },
				blobOptions
			);
			let blob = new Blob(mediaChunks.current, blobPropertyBag);

			//const blobUrl = URL.createObjectURL(blob);

			mediaStream.current = null;
			setStatus("stopped");
			setMediaBlob(blob);
			onStop(blob);
		}

		/** error Callback */
		function handleError(e) {
			setError(e.error);
			setStatus("idle");
			onError(e.error);
		}

		function pauseRecording() {
			if (
				mediaRecorder.current &&
				mediaRecorder.current.state === "recording"
			) {
				mediaRecorder.current.pause();
			}
		}

		function resumeRecording() {
			if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
				mediaRecorder.current.resume();
			}
		}
		//stop
		function stopRecording() {
			if (mediaRecorder.current) {
				setStatus("stopping");
				mediaRecorder.current.stop();
				console.log("stopped");
				mediaRecorder.current.removeEventListener(
					"dataavailable",
					handleDataAvailable
				);
				mediaRecorder.current.removeEventListener("stop", handleStop);
				mediaRecorder.current.removeEventListener("error", handleError);
				mediaRecorder.current = null;
				clearMediaStream();
			}
		}

		useEffect(() => {
			if (!window.MediaRecorder) {
				throw new ReferenceError(
					"MediaRecorder is not supported in this browser. Please ensure that you are running the latest version of chrome/firefox/edge."
				);
			}

			if (recordScreen && !window.navigator.mediaDevices.getDisplayMedia) {
				throw new ReferenceError(
					"This browser does not support screen capturing"
				);
			}

			if (isObject(mediaStreamConstraints.video)) {
				validateMediaTrackConstraints(mediaStreamConstraints.video);
			}

			if (isObject(mediaStreamConstraints.audio)) {
				validateMediaTrackConstraints(mediaStreamConstraints.audio);
			}

			if (mediaRecorderOptions && mediaRecorderOptions.mimeType) {
				if (!MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)) {
					console.error(
						`The specified MIME type supplied to MediaRecorder is not supported by this browser.`
					);
				}
			}
		}, [mediaStreamConstraints, mediaRecorderOptions, recordScreen]);

		return {
			error,
			status,
			mediaBlob,
			stopRecording,
			getMediaStream,
			startRecording,
			pauseRecording,
			resumeRecording,
			clearMediaStream,
			get liveStream() {
				if (mediaStream.current) {
					return new MediaStream(mediaStream.current.getVideoTracks());
				}
				return null;
			},
		};
	}

	/** Screen recording preview component */
	function LiveStreamPreview({ stream }) {
		let videoPreviewRef = useRef();

		useEffect(() => {
			if (videoPreviewRef.current && stream) {
				videoPreviewRef.current.srcObject = stream;
			}
		}, [stream]);

		if (!stream) {
			return null;
		}

		return (
			<video
				ref={videoPreviewRef}
				width={520}
				height={480}
				autoPlay
			/>
		);
	}

	/** Recording and playback components */
	function Player({ srcBlob }) {
		if (!srcBlob) {
			return null;
		}

		return (
			<video
				src={URL.createObjectURL(srcBlob)}
				width={520}
				height={480}
				controls
			/>
		);
	}

	let [recordScreen] = useState(true);
	let {
		status,
		liveStream,
		mediaBlob,
		stopRecording,
		startRecording,
		pauseRecording,
		resumeRecording,
		clearMediaStream,
	} = useMediaRecorder({
		recordScreen,
		mediaStreamConstraints: { audio: true, video: true },
	});

	/** It will execute when component mount */
	//eslint-disable-next-line
	useEffect(() => clearMediaStream, []);

	return (
		<Context.Provider
			value={{
				status,
				liveStream,
				mediaBlob,
				stopRecording,
				startRecording,
				pauseRecording,
				resumeRecording,
				clearMediaStream,
				Player,
				LiveStreamPreview,
			}}
		>
			{children}
		</Context.Provider>
	);
};
