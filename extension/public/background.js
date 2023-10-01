// // Initialize variables to manage recording sessions
// let mediaRecorderFullScreen; // MediaRecorder instance for full screen recording
// let mediaRecorderTab; // MediaRecorder instance for current tab recording
// let chunksFullScreen = []; // Array to store recorded data chunks for full screen
// let chunksTab = []; // Array to store recorded data chunks for tab

// // Event listener for messages from popup.jsx
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	if (message.action === "start_full_screen_recording") {
// 		// Check if a full screen recording session is already active
// 		if (
// 			mediaRecorderFullScreen &&
// 			mediaRecorderFullScreen.state === "recording"
// 		) {
// 			console.log("A full screen recording session is already active.");
// 			return;
// 		}

// 		// Specify media constraints for full screen recording
// 		const mediaConstraintsFullScreen = {
// 			audio: false, // You can enable audio capture if needed
// 			video: {
// 				mandatory: {
// 					chromeMediaSource: "desktop",
// 					chromeMediaSourceId: "screen",
// 					maxWidth: window.screen.width,
// 					maxHeight: window.screen.height,
// 				},
// 			},
// 		};

// 		// Request full screen capture permission and start recording
// 		navigator.mediaDevices
// 			.getUserMedia(mediaConstraintsFullScreen)
// 			.then((stream) => {
// 				// Create a new MediaRecorder instance for full screen recording
// 				mediaRecorderFullScreen = new MediaRecorder(stream);

// 				// Handle data available event (recorded data chunks for full screen)
// 				mediaRecorderFullScreen.ondataavailable = (e) => {
// 					if (e.data.size > 0) {
// 						chunksFullScreen.push(e.data);
// 					}
// 				};

// 				// Handle recording stop event for full screen recording
// 				mediaRecorderFullScreen.onstop = () => {
// 					const blob = new Blob(chunksFullScreen, { type: "video/webm" });
// 					// Send the recorded video blob or URL to your endpoint for full screen recording
// 					sendRecordingToServer(blob);

// 					// Reset chunks for the next full screen recording
// 					chunksFullScreen = [];
// 				};

// 				// Start full screen recording
// 				mediaRecorderFullScreen.start();
// 			})
// 			.catch((error) => {
// 				console.error(
// 					"Error accessing user media for full screen recording:",
// 					error
// 				);
// 			});
// 	} else if (message.action === "start_tab_recording") {
// 		// Check if a tab recording session is already active
// 		if (mediaRecorderTab && mediaRecorderTab.state === "recording") {
// 			console.log("A tab recording session is already active.");
// 			return;
// 		}

// 		// Specify media constraints for tab recording
// 		const mediaConstraintsTab = {
// 			audio: false, // You can enable audio capture if needed
// 			video: {
// 				mandatory: {
// 					chromeMediaSource: "tab",
// 				},
// 			},
// 		};

// 		// Get the current active tab for recording
// 		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// 			if (tabs.length > 0) {
// 				// Capture the current tab
// 				chrome.tabCapture.capture(mediaConstraintsTab, (stream) => {
// 					if (stream) {
// 						// Create a new MediaRecorder instance for tab recording
// 						mediaRecorderTab = new MediaRecorder(stream);

// 						// Handle data available event (recorded data chunks for tab)
// 						mediaRecorderTab.ondataavailable = (e) => {
// 							if (e.data.size > 0) {
// 								chunksTab.push(e.data);
// 							}
// 						};

// 						// Handle recording stop event for tab recording
// 						mediaRecorderTab.onstop = () => {
// 							const blob = new Blob(chunksTab, { type: "video/webm" });
// 							// Send the recorded video blob or URL to your endpoint for tab recording
// 							sendRecordingToServer(blob);

// 							// Reset chunks for the next tab recording
// 							chunksTab = [];
// 						};

// 						// Start tab recording
// 						mediaRecorderTab.start();
// 					} else {
// 						console.error("Error capturing tab for recording.");
// 					}
// 				});
// 			} else {
// 				console.error("No active tab found for recording.");
// 			}
// 		});
// 	} else if (message.action === "stop_recording") {
// 		// Check if a full screen recording session is active and stop it
// 		if (
// 			mediaRecorderFullScreen &&
// 			mediaRecorderFullScreen.state === "recording"
// 		) {
// 			mediaRecorderFullScreen.stop();
// 		}

// 		// Check if a tab recording session is active and stop it
// 		if (mediaRecorderTab && mediaRecorderTab.state === "recording") {
// 			mediaRecorderTab.stop();
// 		}
// 	}
// });

// // Function to send the recording to your server (implement this)
// function sendRecordingToServer(blob) {
// 	console.log("Sending recording to server:", blob);
// 	// Implement the code to send the recording blob to your server here
// 	// You can use the Fetch API or Axios for this purpose
// }

console.log("injected");
