import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "@context";
import { Button, Loader, Select } from "@components";
import { getProduct } from "@utils";
import { CartModel, ProductModel } from "@models";
import { defaultImage, loaderImg } from "@utils";
import styles from "./Product.module.scss";
import rect from "@assets/images/magnifier.png";

const ratio = 3.5;

// TODO: Handle errors when there is no product
export const Product = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { addToCart } = useStore();

	const [loading, setLoading] = useState<boolean>(true);
	const [empty, setEmpty] = useState<boolean>(false);
	const [imgError, setImgError] = useState<boolean>(false);
	const [imgLoaded, setImgLoaded] = useState<boolean>(false);
	const [product, setProduct] = useState<ProductModel | null>(null);
	const [quantity, setQuantity] = useState<number>(1);

	const [currentImage, setCurrentImage] = useState<string | undefined>("");
	const [zoomActive, setZoomActive] = useState<boolean>(false);

	/* Nodes */
	const [imgNode, setImgNode] = useState<HTMLImageElement | null>(null);
	const [rectNode, setRectNode] = useState<HTMLDivElement | null>(null);
	const [zoomNode, setZoomNode] = useState<HTMLDivElement | null>(null);

	const ImgRef = useCallback((node: HTMLImageElement) => {
		if (node === null) return;
		setImgNode(node);
		return node;
	}, []);

	const rectRef = useCallback((node: HTMLImageElement) => {
		if (node === null) return;
		setRectNode(node);
	}, []);

	const zoomRef = useCallback((node: HTMLDivElement) => {
		if (node === null) return;
		setZoomNode(node);
	}, []);

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

	const onMouseEnter = () => {
		rectNode?.classList.add(styles.active);
		zoomNode?.classList.add(styles.active);
		setZoomActive(true);
	};

	const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (imgNode === null || rectNode === null || zoomNode === null) return;
		const imgCR = imgNode.getBoundingClientRect();
		const rectCR = rectNode.getBoundingClientRect();
		const { left, top, width, height } = imgCR || {
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
			zoomNode.style.backgroundImage = `url(${currentImage})`;
			zoomNode.style.backgroundSize = `${width * ratio}px ${height * ratio}px`;
			zoomNode.style.width = `${rectWidth * ratio}px`;
			zoomNode.style.height = `${rectHeight * ratio}px`;
			zoomNode.style.backgroundPosition = `-${zoomX}px -${zoomY}px`;
		}
	};

	const onMouseLeave = () => {
		rectNode?.classList.remove(styles.active);
		zoomNode?.classList.remove(styles.active);
		setZoomActive(false);
	};

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
							{product.images.map((image, index) => {
								let imgLoaded = false;
								let imgError = false;

								return (
									<li
										key={index}
										className={`${styles.thumbnails__item} ${
											image === currentImage ? styles.active : ""
										} skeleton`}
										onMouseEnter={() => setCurrentImage(!imgError ? image : defaultImage)}
									>
										<img
											alt={product.title}
											src={loaderImg(50, 50)}
											className="hide"
											onLoad={(e) => {
												imgLoaded = true;
												const target = e.target as HTMLImageElement;

												if (!imgError) {
													target.src = image;
													if (imgLoaded) {
														target.classList.remove("hide");
														target.parentElement?.classList.remove("skeleton");
													}
												}
											}}
											onError={(e) => {
												imgError = true;
												const target = e.target as HTMLImageElement;
												target.classList.remove("hide");
												target.parentElement?.classList.remove("skeleton");
												target.src = defaultImage;
											}}
											width={50}
											height={50}
										/>
									</li>
								);
							})}
						</ul>
						<div className={styles.image}>
							<div
								className={`${styles.image__container} skeleton`}
								onMouseEnter={onMouseEnter}
								onMouseMove={onMouseMove}
								onMouseLeave={onMouseLeave}
							>
								<img ref={rectRef} className={styles.image__rect} src={rect} alt="magnifier" />
								<img
									ref={ImgRef}
									src={loaderImg(300, 300)}
									alt={product.title}
									className={`${styles.image__product} hide`}
									onLoad={() => {
										setImgLoaded(true);
										if (imgNode !== null && !imgError) {
											imgNode.src = currentImage || defaultImage;
											if (imgLoaded) {
												imgNode.classList.remove("hide");
												imgNode.parentElement?.classList.remove("skeleton");
											}
										}
									}}
									onError={() => {
										setImgError(true);
										setCurrentImage(defaultImage);
										if (imgNode !== null) {
											imgNode.src = defaultImage;
											imgNode.classList.remove("hide");
											imgNode.parentElement?.classList.remove("skeleton");
										}
									}}
									width={300}
									height={300}
								/>
							</div>
							<p className={styles.image__text}>
								{zoomActive ? (
									<span>Move cursor over image to zoom in</span>
								) : (
									<span>Hover over image to zoom in</span>
								)}
							</p>
						</div>
						<div className={styles.description}>
							<div ref={zoomRef} className={styles.description__zoom} />
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
