import styles from "./Button.module.scss";

interface Props {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	onClick: () => void;
}

const Button = ({ children, onClick, className = "", ...props }: Props) => {
	return (
		<button className={`${styles.button} ${className ?? ""}`} onClick={onClick} {...props}>
			{children}
		</button>
	);
};

export { Button };
