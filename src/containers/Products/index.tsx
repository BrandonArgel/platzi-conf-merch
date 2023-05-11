import { Children } from "react";
import { useFilters } from "@context";
import { Loader } from "@components";
import styles from "./Products.module.scss";

interface ProductProps {
	children?: React.ReactNode;
}

export const Products: React.FC<ProductProps> = ({ children }) => {
	const { loading, error } = useFilters();

	return (
		<div className={styles.products}>
			{loading ? (
				<div className={styles.products__loader}>
					<Loader />
				</div>
			) : error ? (
				<div className={styles.products__error}>
					<p aria-live="assertive">{error}</p>
				</div>
			) : !Children.count(children) ? (
				<div className={styles.products__empty}>
					<p>No products where found.</p>
				</div>
			) : (
				children
			)}
		</div>
	);
};
