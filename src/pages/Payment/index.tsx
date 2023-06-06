import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useStore } from "@context";
import { useNavigate } from "react-router-dom";
import styles from "./Payment.module.scss";

export const Payment = () => {
	const { VITE_PAYPAL_CLIENT_ID } = import.meta.env;
	const {
		// state: { cart, cartTotal, buyer },
		state: { cart, cartTotal },
	} = useStore();
	const [paidFor, setPaidFor] = useState(false);

	const history = useNavigate();
	if (paidFor) {
		history("/checkout/success");
	}

	return (
		<div className={styles.payment}>
			<h3 className={styles.payment__title}>Summary of your purchase:</h3>
			<div>
				<div className={styles.payment__items}>
					{cart.length > 0 ? (
						cart.map((product, index) => (
							<div key={index} className={styles.payment__item}>
								<h4>{product.title}</h4>
								<span>{product.price}</span>
							</div>
						))
					) : (
						<h4 className={styles.payment__empty}>No hay productos en el carrito.</h4>
					)}
					<div></div>
				</div>
			</div>
			<div className={styles.payment__buttons}>
				<div className={styles.payment__total}>
					<h3>Total:</h3>
					<p>
						<span className={styles.payment__amount}>${cartTotal}</span>
						<span className={styles.payment__discount}>$0.01</span>
					</p>
				</div>
				<PayPalScriptProvider options={{ "client-id": VITE_PAYPAL_CLIENT_ID }}>
					<PayPalButtons
						disabled={cart.length === 0}
						createOrder={(_, actions) => {
							return actions.order.create({
								purchase_units: [
									{
										description: "Compra en Platzi Conf Merch",
										amount: {
											currency_code: "USD",
											// value: `${cartTotal}`,
											value: "0.01",
										},
									},
								],
							});
						}}
						onApprove={(data, actions) => {
							return actions.order!.capture().then((details) => {
								console.log("Approve", { data });
								setPaidFor(true);
								console.log(details);
							});
						}}
						onError={(err) => {
							console.log("Error", err);
						}}
					/>
				</PayPalScriptProvider>
			</div>
		</div>
	);
};
