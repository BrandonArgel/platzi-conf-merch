import { useStore } from "@context";
import styles from "./Products.module.scss";

interface ProductProps {
	children?: React.ReactNode;
}

export const Products: React.FC<ProductProps> = ({ children }) => {
	const { loading, error } = useStore();

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return <div className={styles.products}>{children}</div>;
};
