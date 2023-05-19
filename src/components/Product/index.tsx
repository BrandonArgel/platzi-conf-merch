import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { ProductModel } from "@models";
import { useLazyLoading } from "@hooks";
import { loaderImg } from "@utils";
import styles from "./Product.module.scss";

export const Product: React.FC<ProductModel> = ({ id, title, price, images, category }) => {
	const navigate = useNavigate();
	const imgRef = useRef<HTMLImageElement>(null);

	useLazyLoading(imgRef);

	return (
		<button className={styles.card} onClick={() => navigate(`/${id}`)} type="button">
			<figure className={`${styles.card__figure} skeleton`}>
				<span className={styles.card__category}>{category.name}</span>
				<img
					alt={title}
					className={`${styles.card__image} hide`}
					data-src={images[0]}
					height={300}
					ref={imgRef}
					src={loaderImg(300, 300)}
					width={300}
				/>
			</figure>
			<div className={styles.card__content}>
				<h3 className={styles.card__title}>{title}</h3>
				<p className={styles.card__price}>${price}</p>
			</div>
		</button>
	);
};
