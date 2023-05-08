import styles from "./styles.module.scss";

export const Header = () => {
	return (
		<div className={styles.header}>
			<h1 className={styles.header__title}>PlatziConf Merch</h1>
			<div className={styles.header__checkout}>Checkout</div>
		</div>
	);
};
