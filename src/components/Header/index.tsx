import { Link } from "react-router-dom";
import { useStore } from "@context";
import styles from "./Header.module.scss";

export const Header = () => {
	const { state } = useStore();
	const { cart } = state;

	return (
		<header className={styles.header}>
			<Link to="/" className={styles.header__logo}>
				<h1>Platzi Conf Merch</h1>
			</Link>
			<div className={styles.header__checkout}>
				<Link to="/checkout" className={styles.header__link}>
					<i className="fas fa-shopping-basket"></i>
				</Link>
				{cart.length ? <div className={styles.header__checkout_cant}>{cart.length}</div> : null}
			</div>
		</header>
	);
};
