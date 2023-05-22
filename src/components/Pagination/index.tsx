import { Button } from "@components";
import styles from "./Pagination.module.scss";

interface PaginationProps {
	page: number;
	loading: boolean;
	limit: boolean;
	handlePrevPage: () => void;
	handleNextPage: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
	page,
	loading,
	limit,
	handlePrevPage,
	handleNextPage,
}) => {
	return (
		<div className={styles.pagination}>
			<Button type="button" onClick={handlePrevPage} disabled={page === 1 || loading}>
				Prev
			</Button>
			<span>Page: {page}</span>
			<Button type="button" onClick={handleNextPage} disabled={limit || loading}>
				Next
			</Button>
		</div>
	);
};

