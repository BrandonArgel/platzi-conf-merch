import { useStore } from "@context";
import { Map } from "@components";
import { useGoogleAddress } from "@hooks";
import styles from "./Success.module.scss";

const defaultPosition = {
	lat: 19.4267261,
	lng: -99.1718706,
};

export const Success = () => {
	const {
		state: {
			buyer: { address, name, city },
		},
	} = useStore();
	const userCoordinates = useGoogleAddress(address, city);

	return (
		<div className={styles.success}>
			<h2>{name}, Gracias por tu compra.</h2>
			<span>Tu pedido llegará en 3 días a tu dirección:</span>
			<Map
				zoom={17}
				center={userCoordinates ?? defaultPosition}
				marker={userCoordinates ?? defaultPosition}
			/>
		</div>
	);
};
