import React from 'react';
import { Button } from '@mui/material';
import { IconReset } from './icons';

interface ZoomControlsProps {
	onZoomIn: () => void;
	onZoomOut: () => void;
	onResetView: () => void;
}
/* TODO REFACTOR STYLING */
const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, onResetView }) => {
	return (
		<div className="zoom-controls" style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', columnGap: '6px' }}>
			<Button
				onClick={onZoomIn}
				variant="contained"
				color="primary"
				size="medium"
			>
				+
			</Button>
			<Button
				onClick={onResetView}
				variant="contained"
				color="primary"
				size="medium"
			>
				<IconReset fill='#fff' />
			</Button>
			<Button
				onClick={onZoomOut}
				variant="contained"
				color="primary"
				size="medium"
			>
				-
			</Button>
		</div>
	);
};

export default ZoomControls;
