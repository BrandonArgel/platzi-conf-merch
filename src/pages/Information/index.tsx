import { Formik, Form, Field, FieldProps, FormikHelpers, FormikErrors, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { useRef, useId } from "react";
import { useStore } from "@context";
import { Alert, Button, Select } from "@components";
import { BuyerModelCreate } from "@models";
import styles from "./Information.module.scss";

type FormValues = Omit<BuyerModelCreate, "id">;

const initialFormState: FormValues = {
	name: "",
	lastName: "",
	email: "",
	address: "",
	city: "",
	country: "",
	state: "",
	zip: "",
	phone: "",
};

const formInputs = [
	{
		name: "name",
		type: "text",
		placeholder: "Full name",
	},
	{
		name: "lastName",
		type: "text",
		placeholder: "Last name",
	},
	{
		name: "email",
		type: "email",
		placeholder: "Email",
	},
	{
		name: "address",
		type: "text",
		placeholder: "Street address",
	},
	{
		name: "city",
		type: "text",
		placeholder: "City",
	},
	{
		name: "country",
		type: "text",
		placeholder: "Country",
	},
	{
		name: "state",
		type: "text",
		placeholder: "State",
	},
	{
		name: "zip",
		type: "text",
		placeholder: "Zip",
	},
	{
		name: "phone",
		type: "text",
		placeholder: "Phone",
	},
];

type inputValidatorsType = {
	[key: string]: (value: string) => string | undefined;
};

const inputValidators: inputValidatorsType = {
	name: (name: string) => {
		let error;
		if (!name) {
			error = "Name is required, please enter a name";
		} else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(name)) {
			error = "Name is invalid, name must be between 1 and 40 characters";
		}
		return error;
	},
	lastName: (lastName: string) => {
		let error;
		if (!lastName) {
			error = "Last name is required, please enter a last name";
		} else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(lastName)) {
			error = "Last name is invalid, last name must be between 1 and 40 characters";
		}
		return error;
	},
	email: (email: string) => {
		let error;
		if (!email) {
			error = "Email is required, please enter an email";
		} else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
			error = "Email is invalid, please enter a valid email";
		}
		return error;
	},
	address: (address: string) => {
		let error;
		if (!address) {
			error = "Address is required, please enter a address";
		} else if (!/^[a-zA-ZÀ-ÿ0-9\s\d]{1,40}$/.test(address)) {
			error = "Address is invalid, Address must be between 1 and 40 characters and numbers";
		}
		return error;
	},
	department: (department: string) => {
		let error;
		if (!department) {
			error = "Department is required, please enter a department";
		} else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(department)) {
			error = "Department is invalid, department must be between 1 and 40 characters";
		}
		return error;
	},
	city: (city: string) => {
		let error;
		if (!city) {
			error = "City is required, please enter a city";
		} else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(city)) {
			error = "City is invalid, city must be between 1 and 40 characters";
		}
		return error;
	},
	country: (country: string) => {
		let error;
		if (!country) {
			error = "Country is required, please enter a country";
		} else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(country)) {
			error = "Country is invalid, country must be between 1 and 40 characters";
		}
		return error;
	},
	state: (state: string) => {
		let error;
		if (!state) {
			error = "State is required, please enter a state";
		} else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(state)) {
			error = "State is invalid, state must be between 1 and 40 characters";
		}
		return error;
	},
	zip: (zip: string) => {
		let error;
		if (!zip) {
			error = "Zip is required, please enter a zip";
		} else if (!/^[0-9]{5}(?:-[0-9]{4})?$/.test(zip)) {
			error = "Zip is invalid, zip must have 4 or 5 digits";
		}
		return error;
	},
	phone: (phone: string) => {
		let error;
		if (!phone) {
			error = "Phone is required, please enter a phone";
		} else if (!/^[0-9]{10}$/.test(phone)) {
			error = "Phone is invalid, phone must have 10 digits";
		}
		return error;
	},
};

export const Information = () => {
	const userId = useId();
	const formRef = useRef(null);
	const navigate = useNavigate();
	const {
		state: { cart, cartTotal },
		addToBuyer,
	} = useStore();

	const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
		try {
			addToBuyer({ ...values, cart, total: cartTotal, id: userId });

			Alert.fire({
				icon: "success",
				title: "Success!",
				text: "Your order has been placed successfully",
			});

			actions.resetForm();
		} catch (error) {
			let errorMessage = "An error has occurred, please try again later";
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			Alert.fire({
				icon: "error",
				title: "Oops...",
				text: errorMessage,
			});
		}

		navigate("/checkout/payment");
	};

	return (
		<div className={styles.information}>
			<div className={styles.information__content}>
				<h2 className={styles.information__title}>Contact information:</h2>
				<Formik
					initialValues={initialFormState}
					validate={(values) => {
						const errors: FormikErrors<FormValues> = {};
						Object.keys(values).forEach((key) => {
							const error = inputValidators[key](values[key as keyof FormValues]);
							if (error) {
								errors[key as keyof FormValues] = error;
							}
						});
						return errors;
					}}
					onSubmit={handleSubmit}
				>
					<Form className={styles.information__form} ref={formRef}>
						{formInputs.map(({ name, placeholder, type }) => (
							<div className={styles.information__form_group} key={name}>
								<Field name={name}>
									{({ field, form: { errors, touched } }: FieldProps<keyof FormValues>) => {
										return (
											<input
												className={`${styles.information__form_input} ${
													errors[name] && touched[name] ? styles.information__form_input_error : ""
												}`}
												type={type}
												placeholder={placeholder}
												{...field}
											/>
										);
									}}
								</Field>
								<ErrorMessage
									className={styles.information__form_error}
									name={name}
									component="span"
								/>
							</div>
						))}
						<div className={styles.information__form_buttons}>
							<button
								className={styles.information__form_button}
								type="button"
								onClick={() => navigate("/checkout")}
							>
								Go back
							</button>
							<Button type="submit" disabled={!cart.length}>
								Pay
							</Button>
						</div>
					</Form>
				</Formik>
			</div>
			<div className={styles.information__sidebar}>
				<h3 className={styles.information__sidebar_title}>Order summary:</h3>
				<div className={styles.information__sidebar_content}>
					{cart.length > 0 ? (
						<ul className={styles.information__sidebar_list}>
							{cart.map(({ id, images, title, quantity, stock, price }, i) => (
								<li key={`${id}${i}`} className={styles.information__sidebar_list_item}>
									<div className={styles.information__sidebar_list_details}>
										<div
											className={styles.information__sidebar_list_info}
											onClick={() => navigate(`/${id}`)}
										>
											<img
												src={images[0]}
												alt={title}
												className={styles.information__sidebar_list_image}
											/>
											<h3 className={styles.information__sidebar_list_title}>{title}</h3>
										</div>
										<div className={styles.information__sidebar_list_actions}>
											<Select
												value={String(quantity)}
												options={[...Array.from({ length: stock }, (_, i) => i + 1)]}
												disabled
											/>
											<p className={styles.information__sidebar_list_price}>${price * quantity}</p>
										</div>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className={styles.empty}>There are no products in the cart.</p>
					)}
					<div className={styles.information__sidebar_total}>
						<p>Total: {cartTotal}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
