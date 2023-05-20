import { useState, useEffect } from "react";
import { Category, Search, Pagination, Product } from "@components";
import { Categories, Products } from "@containers";
import { useSearch } from "@context";
import { useDebounce } from "@hooks";

const Home = () => {
	const {
		state: { categories, products, page },
		loading,
		setLoading,
		setSearch,
		resetSearch,
		setPage,
		resetPage,
		setCategory,
		getCategoryId,
		resetCategory,
	} = useSearch();
	const [newSearch, setNewSearch] = useState("");
	const debouncedSearch = useDebounce(newSearch, 500);
	const limit = products && products.length < 20;

	useEffect(() => {
		if (debouncedSearch) {
			setSearch(debouncedSearch);
		} else {
			resetSearch();
		}
	}, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const paramsURL = new URLSearchParams(window.location.search);
		const searchParam = paramsURL.get("search") || "";
		setNewSearch(searchParam);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoading(true);
		setNewSearch(e.target.value);
	};

	const handlePrevPage = () => {
		setLoading(true);
		if (page - 1 === 1) {
			resetPage();
		} else {
			setPage(page - 1);
		}
	};

	const handleNextPage = () => {
		setLoading(true);
		setPage(page + 1);
	};

	return (
		<>
			<Search search={newSearch} placeholder="Search for products..." onChange={onSearch} />
			<Categories>
				<li onClick={resetCategory}>
					<Category name="All" active={!getCategoryId()} />
				</li>
				{categories &&
					categories.length > 0 &&
					categories.map(({ name, id }) => (
						<li key={id} onClick={() => setCategory(id)}>
							<Category name={name} active={getCategoryId() === id} />
						</li>
					))}
			</Categories>
			<Products>
				{products && products.map((product) => <Product key={product.id} {...product} />)}
			</Products>
			<Pagination
				page={page}
				loading={loading}
				limit={limit}
				handlePrevPage={handlePrevPage}
				handleNextPage={handleNextPage}
			/>
		</>
	);
};

export { Home };
