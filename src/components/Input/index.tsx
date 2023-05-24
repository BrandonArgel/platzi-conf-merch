import { FC, InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label?: string;
	error?: string;
	type?: string;
}

export const Input: FC<InputProps> = ({ name, label, error, ...rest }) => {
	return (
		<div className={styles.input}>
			{label && (
				<label htmlFor={name} className={styles.input__label}>
					{label}
				</label>
			)}
			<input
				className={`${styles.input__field} ${error ? styles.input__field__error : ""}`}
				id={name}
				name={name}
				type={rest.type || "text"}
				{...rest}
			/>
			{error && <span className={styles.input__error}>{error}</span>}
		</div>
	);
};
