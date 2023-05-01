import styles from "./styles.module.scss";

const Header = () => {
	return (
		<div className={styles.header}>
			<h1 className={styles.header__title}>PlatziConf Merch</h1>
			<div className={styles.header__checkout}>Checkout</div>
		</div>
	);
};

export { Header };
