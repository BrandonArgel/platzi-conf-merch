import * as React from "react";
import styles from "./Search.module.scss";

interface Props {
	search: string;
	placeholder: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Search = ({ search = "", placeholder, onChange }: Props) => {
	return (
		<div className={styles.search}>
			<input
				autoComplete="off"
				className={styles.search__input}
				onChange={onChange}
				placeholder={placeholder}
				type="search"
				value={search}
			/>
			<button title="search" tabIndex={0} className={styles.search__button}>
				<i className="fas fa-search"></i>
			</button>
		</div>
	);
};
