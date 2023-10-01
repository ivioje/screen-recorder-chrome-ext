import React, { useContext } from "react";
import { Context } from "../Context";

const Preview = () => {
	const { liveStream, mediaBlob, LiveStreamPreview, Player } =
		useContext(Context);
	return (
		<div>
			{/* <LiveStreamPreview stream={liveStream} /> */}
			<Player srcBlob={mediaBlob} />
		</div>
	);
};

export default Preview;
