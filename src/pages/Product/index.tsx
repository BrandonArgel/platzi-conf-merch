import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "@context";
import { Button, Loader } from "@components";
import { getProduct } from "@utils";
import { ProductModel } from "@models";
import styles from "./Product.module.scss";

// TODO: Handle errors when there is no product

export const Product = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { addToCart } = useStore();
	const [loading, setLoading] = useState<boolean>(true);
	const [empty, setEmpty] = useState<boolean>(false);
	const [product, setProduct] = useState<ProductModel | null>(null);
	const [currentImage, setCurrentImage] = useState<string | undefined>("");

	const initialRequest = async () => {
		try {
			const product = await getProduct(Number(id));
			console.log({ product });
			setProduct(product);
			setCurrentImage(product.images[0]);
		} catch (error) {
			setEmpty(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		initialRequest();
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className={styles.container}>
			{loading ? (
				<div className={styles.loader}>
					<Loader />
				</div>
			) : empty ? (
				<div className={styles.empty}>
					<p>This product does not exist.</p>
					<Button onClick={() => navigate("/")}>Go back home</Button>
				</div>
			) : (
				product && (
					<>
						<h2 className={styles.title}>{product.title}</h2>
						<ul className={styles.thumbnails}>
							{product.images.map((image, index) => (
								<li
									key={index}
									className={`${styles.thumbnails__item} ${
										image === currentImage ? styles.active : ""
									}`}
									onMouseEnter={() => setCurrentImage(image)}
								>
									<img src={image} alt={product.title} />
								</li>
							))}
						</ul>
						<img src={currentImage} alt={product.title} className={styles.image} />
						<div className={styles.content}>
							<p className={styles.content__price}>${product.price}</p>
							<p className={styles.content__description}>{product.description}</p>
							<Button onClick={() => addToCart(product)} className={styles.content__add}>
								Agregar al carrito
							</Button>
						</div>
					</>
				)
			)}
		</div>
	);
};
