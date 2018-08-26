import React from 'react';

function InfoWindow(props) {
	const { currentMarker, infoContent } = props;

	return (
		<aside 
			className="info-window-box"
			tabIndex={0}
		>
			<p className="attribution">Wikipedia source</p>
			<h2>{currentMarker.title}</h2>
			<article>
				{infoContent}
			</article>
		</aside>
	);
}

export default InfoWindow;