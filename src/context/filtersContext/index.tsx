import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { getProducts } from "@utils";
import { ProductModel } from "@models";

// type PriceRange = {
// 	min: number;
// 	max: number;
// };

type FiltersState = {
	products: ProductModel[];
	params: URLSearchParams;
};

type FiltersActions = "INITIALIZE_FILTERS" | "SET_SEARCH" | "SET_PAGE" | "SET_CATEGORY";
// | "SET_PRICE"
// | "SET_PRICE_RANGE";

type FiltersAction = {
	type: FiltersActions;
	payload?: any;
};

type FiltersContextType = {
	state: FiltersState;
	loading: boolean;
	error: string;
	setSearch: (payload: string) => void;
	setPage: (payload: number) => void;
	setCategory: (payload: number) => void;
	// setPrice: (payload: number) => void;
	// setPriceRange: (payload: PriceRange) => void;
};

interface FiltersMethod<Payload, Return> {
	(state: FiltersState, payload: Payload): Return;
}

const paramsAvailables = ["search", "page", "category", "price", "min", "max"];

const initialState: FiltersState = {
	products: [],
	params: new URLSearchParams(),
};

const filtersMethods: Record<string, FiltersMethod<any, FiltersState>> = {
	INITIALIZE_FILTERS: (state: FiltersState, payload: FiltersState) => {
		return { ...state, ...payload };
	},
	SET_SEARCH: (state: FiltersState, payload: string) => {
		const params = new URLSearchParams(state.params);
		params.set("search", payload);

		return { ...state, params };
	},
	SET_PAGE: (state: FiltersState, payload: number) => {
		const params = new URLSearchParams(state.params);
		params.set("page", payload.toString());

		return { ...state, params };
	},
	SET_CATEGORY: (state: FiltersState, payload: number) => {
		const params = new URLSearchParams(state.params);
		params.set("category", payload.toString());
		return { ...state, params };
	},
	// SET_PRICE: (state: FiltersState, payload: number) => {
	// 	const params = new URLSearchParams(state.params);
	//  params.delete("min")
	//  params.delete("max")
	// 	params.set("price", payload.toString());
	// 	return { ...state, params };
	// },
	// SET_PRICE_RANGE: (state: FiltersState, payload: PriceRange) => {
	// 	const params = new URLSearchParams(state.params);
	// 	params.set("min", payload.min.toString());
	// 	params.set("max", payload.max.toString());
	// 	params.delete("price");
	// 	return { ...state, params };
	// },
};

const storeReducer = (state: FiltersState, action: FiltersAction) => {
	const { type, payload } = action;

	return filtersMethods[type](state, payload);
};

const storeContext = createContext<FiltersContextType>({
	state: initialState,
	loading: true,
	error: "",
	setSearch: () => undefined,
	setPage: () => undefined,
	setCategory: () => undefined,
	// setPrice: () => undefined,
	// setPriceRange: () => undefined,
});

const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(storeReducer, initialState);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	const getInitialParams = () => {
		const currentParams = new URLSearchParams(window.location.search);
		const params = new URLSearchParams();

		paramsAvailables.forEach((param) => {
			const value = currentParams.get(param);
			if (value) {
				params.set(param, value);
			}
		});

		return params;
	};

	const getProductsFromParams = async (params: URLSearchParams) => {
		window.history.replaceState({}, "", `${window.location.pathname}?${params}`);

		try {
			return await getProducts(params);
		} catch (error) {
			let errorMessage = "An error has occurred fetching the products.";
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			setError(errorMessage);
		} finally {
			setLoading(false);
			setInitialized(true);
		}
	};

	const initializeStore = async () => {
		setLoading(true);

		const params = getInitialParams();
		const products = await getProductsFromParams(params);

		dispatch({
			type: "INITIALIZE_FILTERS",
			payload: {
				products,
				params,
			},
		});
	};

	const setSearch = (search: string) => {
		dispatch({
			type: "SET_SEARCH",
			payload: search,
		});
	};

	const setPage = (page: number) => {
		dispatch({
			type: "SET_PAGE",
			payload: page,
		});
	};

	const setCategory = (category: number) => {
		dispatch({
			type: "SET_CATEGORY",
			payload: category,
		});
	};

	// const setPrice = (price: number) => {
	// 	dispatch({
	// 		type: "SET_PRICE",
	// 		payload: price,
	// 	});
	// };

	// const setPriceRange = (priceRange: PriceRange) => {
	// 	dispatch({
	// 		type: "SET_PRICE_RANGE",
	// 		payload: priceRange,
	// 	});
	// };

	useEffect(() => {
		if (!initialized) {
			initializeStore();

			return;
		}

		getProductsFromParams(state.params);

		return () => {
			setInitialized(false);
		};
	}, [state.params]); // eslint-disable-line react-hooks/exhaustive-deps

	const value = {
		state,
		loading,
		error,
		setSearch,
		setPage,
		setCategory,
		// setPrice,
		// setPriceRange,
	};

	return <storeContext.Provider value={value}>{children}</storeContext.Provider>;
};

const useFilters = () => {
	const context = useContext(storeContext);
	if (context === undefined) {
		throw new Error("useStore must be used within a FiltersProvider");
	}
	return context;
};

export { useFilters, FiltersProvider };
