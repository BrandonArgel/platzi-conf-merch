import React from "react";
import { Product } from "@models";
import styles from "./styles.module.scss";

interface ProductProps {
	products: Product[] | undefined;
}

export const Products: React.FC<ProductProps> = ({ products }) => {
	return (
		<div className={styles.products}>
			{products?.length &&
				products.map((product: Product) => (
					<div key={product.id} className={styles.products__item}>
						<img src={product.image} alt={product.title} className={styles.products__img} />
						<h3 className={styles.products__title}>{product.title}</h3>
						<span className={styles.products__price}>${product.price}</span>
						<p className={styles.products__description}>{product.description}</p>
						<button type="button" className={styles.products__button}>
							Add to cart
						</button>
					</div>
				))}
		</div>
	);
};
