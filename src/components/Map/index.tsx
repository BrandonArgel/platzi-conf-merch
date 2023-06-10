import { FC } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { PositionModel } from "@models";

const mapStyles = {
	height: "50vh",
	width: "100%",
};

type MapProps = {
	zoom?: number;
	center: PositionModel;
	marker: PositionModel;
};

export const Map: FC<MapProps> = ({ zoom = 10, center, marker }) => {
	const { VITE_GOOGLE_MAPS_API_KEY } = import.meta.env;

	return (
		<LoadScript googleMapsApiKey={VITE_GOOGLE_MAPS_API_KEY}>
			<GoogleMap mapContainerStyle={mapStyles} zoom={zoom} center={center}>
				{marker && <Marker position={marker} />}
			</GoogleMap>
		</LoadScript>
	);
};
