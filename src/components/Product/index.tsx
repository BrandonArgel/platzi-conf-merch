import { useNavigate } from "react-router-dom";
import { ProductModel } from "@models";
import styles from "./Product.module.scss";

export const Product: React.FC<ProductModel> = ({ id, title, price, images, category }) => {
	const navigate = useNavigate();
	return (
		<button className={styles.card} onClick={() => navigate(`/product/${id}`)} type="button">
			<figure className={styles.card__image}>
				<span className={styles.card__category}>{category.name}</span>
				<img src={images[0]} alt={title} />
			</figure>
			<div className={styles.card__content}>
				<h3 className={styles.card__title}>{title}</h3>
				<p className={styles.card__price}>${price}</p>
			</div>
		</button>
	);
};
