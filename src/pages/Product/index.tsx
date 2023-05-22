import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@context";
import { Button, Loader, Select } from "@components";
import { getProduct } from "@utils";
import { CartModel, ProductModel } from "@models";
import styles from "./Product.module.scss";
import rect from "@assets/images/magnifier.png";

// TODO: Handle errors when there is no product

export const Product = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { addToCart } = useStore();

	/* Refs */
	const containerImgRef = useRef<HTMLDivElement>(null);
	const rectRef = useRef<HTMLImageElement>(null);
	const zoomRef = useRef<HTMLImageElement>(null);

	/* States */
	const [loading, setLoading] = useState<boolean>(true);
	const [empty, setEmpty] = useState<boolean>(false);
	const [product, setProduct] = useState<ProductModel | null>(null);
	const [quantity, setQuantity] = useState<number>(1);
	const [currentImage, setCurrentImage] = useState<string | undefined>("");

	const initialRequest = async () => {
		try {
			const product = await getProduct(Number(id));
			setProduct(product);
			setCurrentImage(product.images[0]);
		} catch (error) {
			console.error({ error });
			setEmpty(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		initialRequest();
	}, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const { current: imgContainer } = containerImgRef;
		const { current: rect } = rectRef;
		const { current: zoom } = zoomRef;

		if (!imgContainer || !rect || !zoom) return;

		const onMouseEnter = () => {
			rect.classList.add(styles.active);
			zoom.classList.add(styles.active);
		};

		const onMouseMove = (e: MouseEvent) => {
			const ratio = 3.5;
			const { left, top, width, height } = imgContainer.getBoundingClientRect();
			const { width: rectWidth, height: rectHeight } = rect.getBoundingClientRect();
			const x = e.clientX - left;
			const y = e.clientY - top;
			const rectX = x - rectWidth / 2;
			const rectY = y - rectHeight / 2;
			const maxX = width - rectWidth;
			const maxY = height - rectHeight;
			let zoomX, zoomY;

			// Zoom background size
			zoom.style.backgroundSize = `${width * ratio}px ${height * ratio}px`;
			// Zoom background width and height
			zoom.style.width = `${rectWidth * ratio}px`;
			zoom.style.height = `${rectHeight * ratio}px`;

			if (rectX < 0) {
				rect.style.left = "0px";
				zoomX = 0;
			} else if (rectX > maxX) {
				rect.style.left = `${maxX}px`;
				zoomX = maxX;
			} else {
				rect.style.left = `${rectX}px`;
				zoomX = rectX;
			}

			if (rectY < 0) {
				rect.style.top = "0px";
				zoomY = 0;
			} else if (rectY > maxY) {
				rect.style.top = `${maxY}px`;
				zoomY = maxY;
			} else {
				rect.style.top = `${rectY}px`;
				zoomY = rectY;
			}

			zoomX = zoomX * ratio;
			zoomY = zoomY * ratio;

			zoom.style.backgroundPosition = `-${zoomX}px -${zoomY}px`;
		};

		const onMouseLeave = () => {
			rect.classList.remove(styles.active);
			zoom.classList.remove(styles.active);
		};

		imgContainer.addEventListener("mouseenter", onMouseEnter);
		imgContainer.addEventListener("mousemove", onMouseMove);
		imgContainer.addEventListener("mouseleave", onMouseLeave);

		return () => {
			if (imgContainer && rect) {
				imgContainer.removeEventListener("mousemove", onMouseMove);
				imgContainer.removeEventListener("mouseenter", onMouseEnter);
				imgContainer.removeEventListener("mouseleave", onMouseLeave);
			}
		};
	}, [containerImgRef.current, containerImgRef.current, rectRef.current, zoomRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

	const onChangeQuantity = (e: string) => {
		setQuantity(Number(e));
	};

	const onClickAddToCart = (newProduct: ProductModel) => {
		if (!newProduct) return;

		const cart: CartModel = {
			id: newProduct.id,
			title: newProduct.title,
			price: newProduct.price,
			images: newProduct.images,
			description: newProduct.description,
			stock: newProduct.stock,
			quantity,
		};

		addToCart(cart);
	};

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
						<div ref={containerImgRef} className={styles.image}>
							<img ref={rectRef} className={styles.image__rect} src={rect} alt="magnifier" />
							<img src={currentImage} alt={product.title} className={styles.image__product} />
						</div>
						<div className={styles.description}>
							<div
								ref={zoomRef}
								style={{ backgroundImage: `url(${currentImage})` }}
								className={styles.description__zoom}
							/>
							<p className={styles.description__text}>
								Price: <span className={styles.description__price}>${product.price}</span>
							</p>
							<p className={styles.description__text}>Availability: {product.stock}</p>
							<p className={styles.description__info}>{product.description}</p>
						</div>
						<div className={styles.actions}>
							<p className={styles.actions__price}>${product.price * quantity}</p>
							<div className={styles.actions__quantity}>
								<label className={styles.actions__label}>
									<span className={styles.actions__text}>Quantity:</span>
									<Select
										title="Quantity"
										value={String(quantity)}
										onChange={onChangeQuantity}
										options={[...Array.from({ length: product.stock }, (_, i) => i + 1)]}
									/>
								</label>
							</div>
							<Button onClick={() => onClickAddToCart(product)} className={styles.actions__add}>
								Add to cart
							</Button>
						</div>
					</>
				)
			)}
		</div>
	);
};
