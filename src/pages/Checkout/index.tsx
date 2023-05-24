import { useNavigate } from "react-router-dom";
import { useStore } from "@context";
import { Button, Select } from "@components";
import styles from "./Checkout.module.scss";

export const Checkout = () => {
	const navigate = useNavigate();
	const {
		state: { cart, cartTotal },
		removeFromCart,
		updateProduct,
	} = useStore();

	const handleQuantityChange = (index: number, quantity: number) => {
		const product = cart[index];
		updateProduct({ ...product, quantity });
	};

	return (
		<div className={styles.container}>
			<div className={styles.details}>
				<h2 className={styles.title}>Checkout</h2>
				{cart.length > 0 ? (
					<ul className={styles.list}>
						{cart.map(({ id, images, title, quantity, stock, price }, i) => (
							<li key={`${id}${i}`} className={styles.list__item}>
								<div className={styles.list__details}>
									<div className={styles.list__info} onClick={() => navigate(`/${id}`)}>
										<img src={images[0]} alt={title} className={styles.list__image} />
										<h3 className={styles.list__title}>{title}</h3>
									</div>
									<div className={styles.list__actions}>
										<label className={styles.list__quantity}>
											<span className={styles.list__text}>Quantity:</span>
											<Select
												value={String(quantity)}
												onChange={(value) => handleQuantityChange(i, Number(value))}
												options={[...Array.from({ length: stock }, (_, i) => i + 1)]}
											/>
										</label>
										<p className={styles.list__price}>${price * quantity}</p>
									</div>
								</div>
								<button onClick={() => removeFromCart(i)} className={styles.list__remove}>
									<i className="fas fa-trash-alt"></i>
								</button>
							</li>
						))}
					</ul>
				) : (
					<p className={styles.empty}>There are no products in the cart.</p>
				)}
			</div>
			<div className={styles.checkout}>
				<h3 className={styles.checkout__title}>Total price: ${cartTotal}</h3>
				<Button onClick={() => navigate("/checkout/information")} disabled={!cartTotal}>
					Continue shopping
				</Button>
			</div>
		</div>
	);
};
