import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@context";
import { Button, Loader, Select } from "@components";
import { getProduct } from "@utils";
import { CartModel, ProductModel } from "@models";
import styles from "./Product.module.scss";
import rect from "@assets/images/magnifier.png";

const ratio = 3.5;

// TODO: Handle errors when there is no product
export const Product = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { addToCart } = useStore();

	// const rectRef = useRef<HTMLImageElement>(null);
	// const zoomRef = useRef<HTMLImageElement>(null);

	const [loading, setLoading] = useState<boolean>(true);
	const [empty, setEmpty] = useState<boolean>(false);
	const [product, setProduct] = useState<ProductModel | null>(null);
	const [quantity, setQuantity] = useState<number>(1);

	/* Refs */
	const [currentImage, setCurrentImage] = useState<string | undefined>("");
	const [imgContainerCR, setImgContainerCR] = useState<DOMRect | undefined>(undefined);
	const [rectCR, setRectCR] = useState<DOMRect | undefined>(undefined);

	/* Nodes */
	const [rectNode, setRectNode] = useState<HTMLDivElement | null>(null);
	const [zoomNode, setZoomNode] = useState<HTMLDivElement | null>(null);

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

	const rectRef = useCallback((node: HTMLImageElement) => {
		if (node === null) return;
		setRectNode(node);
		setRectCR(node.getBoundingClientRect());
	}, []);

	const zoomRef = useCallback((node: HTMLDivElement) => {
		if (node === null) return;
		setZoomNode(node);
	}, []);

	const containerImgRef = useCallback(
		(node: HTMLDivElement) => {
			if (node === null) return;

			const onMouseEnter = () => {
				rectNode?.classList.add(styles.active);
				zoomNode?.classList.add(styles.active);
			};

			const onMouseMove = (e: MouseEvent) => {
				const { left, top, width, height } = imgContainerCR || {
					left: 0,
					top: 0,
					width: 0,
					height: 0,
				};
				const { width: rectWidth, height: rectHeight } = rectCR || { width: 0, height: 0 };
				const x = e.clientX - left;
				const y = e.clientY - top;
				const rectX = x - rectWidth / 2;
				const rectY = y - rectHeight / 2;
				const maxX = width - rectWidth;
				const maxY = height - rectHeight;
				let zoomX, zoomY;

				if (rectNode !== null) {
					if (rectX < 0) {
						rectNode.style.left = "0px";
						zoomX = 0;
					} else if (rectX > maxX) {
						rectNode.style.left = `${maxX}px`;
						zoomX = maxX;
					} else {
						rectNode.style.left = `${rectX}px`;
						zoomX = rectX;
					}

					if (rectY < 0) {
						rectNode.style.top = "0px";
						zoomY = 0;
					} else if (rectY > maxY) {
						rectNode.style.top = `${maxY}px`;
						zoomY = maxY;
					} else {
						rectNode.style.top = `${rectY}px`;
						zoomY = rectY;
					}

					zoomX = zoomX * ratio;
					zoomY = zoomY * ratio;
				}
				if (zoomNode !== null) {
					// Zoom background size
					zoomNode.style.backgroundSize = `${width * ratio}px ${height * ratio}px`;
					// Zoom background width and height
					zoomNode.style.width = `${rectWidth * ratio}px`;
					zoomNode.style.height = `${rectHeight * ratio}px`;

					zoomNode.style.backgroundPosition = `-${zoomX}px -${zoomY}px`;
				}
			};

			const onMouseLeave = () => {
				rectNode?.classList.remove(styles.active);
				zoomNode?.classList.remove(styles.active);
			};

			setImgContainerCR(node.getBoundingClientRect());

			node.addEventListener("mouseenter", onMouseEnter);
			node.addEventListener("mousemove", onMouseMove);
			node.addEventListener("mouseleave", onMouseLeave);
		},
		[rectNode, zoomNode] // eslint-disable-line react-hooks/exhaustive-deps
	);

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
						<div className={styles.image}>
							<div ref={containerImgRef} className={styles.image__container}>
								<img ref={rectRef} className={styles.image__rect} src={rect} alt="magnifier" />
								<img src={currentImage} alt={product.title} className={styles.image__product} />
							</div>
							<p className={styles.image__text}>Pass the mouse over the image to apply zoom.</p>
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
