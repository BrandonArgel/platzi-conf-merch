import { Children } from "react";
import styles from "./Categories.module.scss";

interface ProductProps {
	children?: React.ReactNode;
}

export const Categories: React.FC<ProductProps> = ({ children }) => {
	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Categories:</h2>
			<ul className={styles.categories}>
				{!Children.count(children) ? (
					<div className={styles.categories__empty}>
						<p>No categories where found.</p>
					</div>
				) : (
					children
				)}
			</ul>
		</div>
	);
};
