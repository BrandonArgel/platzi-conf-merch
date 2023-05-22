import { Button } from "@components";
import styles from "./Category.module.scss";

interface CategoryProps {
	name?: string;
	active?: boolean;
}

export const Category: React.FC<CategoryProps> = ({ name, active }) => {
	return <Button className={`${styles.category} ${active ? styles.active : ""}`}>{name}</Button>;
};

