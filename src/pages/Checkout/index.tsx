import { useNavigate } from "react-router-dom";
import { useStore } from "@context";
import { Button } from "@components";
import styles from "./Checkout.module.scss";

const Checkout = () => {
	const navigate = useNavigate();
	const {
		state: { cart, cartTotal },
		removeFromCart,
	} = useStore();

	return (
		<div className={styles.container}>
			<div className={styles.details}>
				<h2 className={styles.title}>Checkout</h2>
				{cart.length > 0 ? (
					<ul className={styles.list}>
						{cart.map((product, index) => (
							<li key={`${product.id}${index}`} className={styles.list__item}>
								<div className={styles.list__details}>
									<div className={styles.list__info} onClick={() => navigate(`/${product.id}`)}>
										<img
											src={product.images[0]}
											alt={product.title}
											className={styles.list__image}
										/>
										<h3 className={styles.list__title}>{product.title}</h3>
									</div>
									<span className={styles.list__price}>${product.price}</span>
								</div>
								<Button onClick={() => removeFromCart(index)}>
									<i className="fas fa-trash-alt"></i>
								</Button>
							</li>
						))}
					</ul>
				) : (
					<p className={styles.empty}>There are no products in the cart.</p>
				)}
			</div>
			<div className={styles.checkout}>
				<h3 className={styles.checkout__title}>Total price: ${cartTotal}</h3>
				<Button onClick={() => navigate("/checkout/information")} disabled={!cartTotal}>Continue shopping</Button>
			</div>
		</div>
	);
};

export { Checkout };
