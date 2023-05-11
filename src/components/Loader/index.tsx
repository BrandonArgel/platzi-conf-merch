import { Loader as LoaderIcon } from "@assets/icons";
import styles from "./Loader.module.scss";

export const Loader = () => {
	return (
		<div className={styles.loader}>
			<LoaderIcon />
		</div>
	);
};
