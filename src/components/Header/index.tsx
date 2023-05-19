import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

interface HeaderProps {
	counter: number;
	resetSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ counter, resetSearch }) => {
	return (
		<header className={styles.header}>
			<Link to="/" className={styles.header__logo} onClick={resetSearch}>
				<h1>Platzi Conf Merch</h1>
			</Link>
			<div className={styles.header__checkout}>
				<Link to="/checkout" className={styles.header__link}>
					<i className="fas fa-shopping-basket"></i>
				</Link>
				{<div className={styles.header__cant}>{counter ?? 0}</div>}
			</div>
		</header>
	);
};
