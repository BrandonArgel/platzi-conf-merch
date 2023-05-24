import styles from "./Select.module.scss";

interface Props {
	title?: string;
	options: string[] | number[];
	onChange?: (value: string) => void;
	value: string;
	multiSelect?: boolean;
	reset?: boolean;
	defaultValue?: string;
	disabled?: boolean;
}

export const Select = ({
	title = "",
	options = [],
	onChange,
	value,
	reset = false,
	defaultValue = "Select an option",
	disabled = false,
}: Props) => {
	return (
		<div className={styles.select}>
			<select
				className={styles.select__dropdown}
				id={title}
				onChange={disabled ? undefined : (e) => onChange && onChange(e.target.value)}
				title={title}
				value={value}
				disabled={disabled}
			>
				{reset && <option value="">{defaultValue}</option>}
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};
