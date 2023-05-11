import { useState, useEffect } from "react";
import { Search, Product } from "@components";
import { Products } from "@containers";
import { useFilters } from "@context";
import { useDebounce } from "@hooks";

const Home = () => {
	const {
		state: { products },
		setLoading,
		setSearchFilters,
		resetSearchFilters,
	} = useFilters();
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500, setLoading);

	useEffect(() => {
		if (debouncedSearch) {
			setSearchFilters(debouncedSearch);
		} else {
			resetSearchFilters();
		}
	}, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const paramsURL = new URLSearchParams(window.location.search);
		const searchParam = paramsURL.get("search") || "";
		setSearch(searchParam);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	return (
		<>
			<Search search={search} placeholder="Search for products..." onChange={onSearch} />
			<Products>
				{products && products.map((product) => <Product key={product.id} {...product} />)}
			</Products>
		</>
	);
};

export { Home };
