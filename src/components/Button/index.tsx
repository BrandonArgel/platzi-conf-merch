import styles from "./Button.module.scss";

interface ButtonProps {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", ...props }) => {
	return (
		<button className={`${styles.button} ${className ?? ""}`} onClick={onClick} {...props}>
			{children}
		</button>
	);
};

export { Button };
