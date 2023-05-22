import styles from "./Select.module.scss";

interface Props {
	title?: string;
	options: string[] | number[];
	onChange: (value: string) => void;
	value: string;
	multiSelect?: boolean;
	reset?: boolean;
	defaultValue?: string;
}

export const Select = ({
	title = "",
	options = [],
	onChange,
	value,
	reset = false,
	defaultValue = "Select an option",
}: Props) => {
	return (
		<div className={styles.select}>
			<select
				className={styles.select__dropdown}
				id={title}
				onChange={(e) => onChange(e.target.value.toLowerCase())}
				title={title}
				value={value}
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
