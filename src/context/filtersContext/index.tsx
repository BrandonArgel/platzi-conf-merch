import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { getProducts } from "@utils";
import { ProductModel } from "@models";

type PriceRange = {
	min: number;
	max: number;
};

type FiltersState = {
	initialized: boolean;
	products: ProductModel[];
	params: URLSearchParams;
};

type FiltersActions =
	| "INITIALIZE_FILTERS"
	| "UPDATE_PRODUCTS"
	| "SET_SEARCH"
	| "RESET_SEARCH"
	| "SET_PAGE"
	| "RESET_PAGE"
	| "SET_CATEGORY"
	| "RESET_CATEGORY"
	| "SET_PRICE"
	| "RESET_PRICE"
	| "SET_PRICE_RANGE"
	| "RESET_PRICE_RANGE";

type FiltersAction = {
	type: FiltersActions;
	payload?: any;
};

type FiltersContextType = {
	state: FiltersState;
	loading: boolean;
	setLoading: (payload: boolean) => void;
	error: string;
	setError: (payload: string) => void;
	setSearchFilters: (payload: string) => void;
	resetSearchFilters: () => void;
	setPageFilters: (payload: number) => void;
	resetPageFilters: () => void;
	setCategoryFilters: (payload: number) => void;
	resetCategoryFilters: () => void;
	setPriceFilters: (payload: number) => void;
	resetPriceFilters: () => void;
	setPriceRangeFilters: (payload: PriceRange) => void;
	resetPriceRangeFilters: () => void;
};

interface FiltersMethod<Payload, Return> {
	(state: FiltersState, payload: Payload): Return;
}

const paramsAvailables = {
	search: "search",
	page: "page",
	category: "category",
	price: "price",
	min: "min",
	max: "max",
};

const initialState: FiltersState = {
	initialized: false,
	products: [],
	params: new URLSearchParams(),
};

const setFiltersMethods: Record<string, FiltersMethod<any, FiltersState>> = {
	INITIALIZE_FILTERS: (state: FiltersState, payload: FiltersState) => {
		return { ...state, ...payload };
	},
	UPDATE_PRODUCTS: (state: FiltersState, payload: ProductModel[]) => {
		return { ...state, products: payload };
	},
	SET_SEARCH: (state: FiltersState, payload: string) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.search, payload);
		return { ...state, params };
	},
	SET_PAGE: (state: FiltersState, payload: number) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.page, payload.toString());
		return { ...state, params };
	},
	SET_CATEGORY: (state: FiltersState, payload: number) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.category, payload.toString());
		return { ...state, params };
	},
	SET_PRICE: (state: FiltersState, payload: number) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.price, payload.toString());
		return { ...state, params };
	},
	SET_PRICE_RANGE: (state: FiltersState, payload: PriceRange) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.min, payload.min.toString());
		params.set(paramsAvailables.max, payload.max.toString());
		return { ...state, params };
	},
};

const resetFiltersMethod = (type: string, state: FiltersState) => {
	const params = new URLSearchParams(state.params);
	if (params.get(type)) params.delete(type);
	else if (type.includes("PRICE_RANGE")) {
		params.delete(paramsAvailables.min);
		params.delete(paramsAvailables.max);
	}
	return { ...state, params };
};

const storeReducer = (state: FiltersState, action: FiltersAction) => {
	const { type, payload } = action;
	if (type.includes("RESET")) {
		const param = type.split("_")[1].toLowerCase();
		return resetFiltersMethod(param, state);
	}

	return setFiltersMethods[type](state, payload);
};

const storeContext = createContext<FiltersContextType>({
	state: initialState,
	loading: true,
	setLoading: () => undefined,
	error: "",
	setError: () => undefined,
	setSearchFilters: () => undefined,
	resetSearchFilters: () => undefined,
	setPageFilters: () => undefined,
	resetPageFilters: () => undefined,
	setCategoryFilters: () => undefined,
	resetCategoryFilters: () => undefined,
	setPriceFilters: () => undefined,
	resetPriceFilters: () => undefined,
	setPriceRangeFilters: () => undefined,
	resetPriceRangeFilters: () => undefined,
});

const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(storeReducer, initialState);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	const updateURL = (params: URLSearchParams) => {
		const newURL = `${window.location.pathname}?${params.toString()}`;
		window.history.replaceState({}, "", newURL);
	};

	const getInitialParams = () => {
		const currentParams = new URLSearchParams(window.location.search);
		const params = new URLSearchParams();

		Object.values(paramsAvailables).forEach((param) => {
			const value = currentParams.get(param);
			if (value) {
				params.set(param, value);
			}
		});

		return params;
	};

	const getProductsFromParams = async (params: URLSearchParams) => {
		try {
			const results = await getProducts(params);
			dispatch({
				type: "UPDATE_PRODUCTS",
				payload: results,
			});
		} catch (error) {
			let errorMessage = "An error has occurred fetching the products.";
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const initializeStore = async () => {
		setLoading(true);

		const params = getInitialParams();
		await getProductsFromParams(params);

		dispatch({
			type: "INITIALIZE_FILTERS",
			payload: {
				params,
				initialized: true,
			},
		});
	};

	const setSearchFilters = (search: string) => {
		dispatch({
			type: "SET_SEARCH",
			payload: search,
		});
	};

	const resetSearchFilters = () => {
		dispatch({
			type: "RESET_SEARCH",
		});
	};

	const setPageFilters = (page: number) => {
		dispatch({
			type: "SET_PAGE",
			payload: page,
		});
	};

	const resetPageFilters = () => {
		dispatch({
			type: "RESET_PAGE",
		});
	};

	const setCategoryFilters = (category: number) => {
		dispatch({
			type: "SET_CATEGORY",
			payload: category,
		});
	};

	const resetCategoryFilters = () => {
		dispatch({
			type: "RESET_CATEGORY",
		});
	};

	const setPriceFilters = (price: number) => {
		dispatch({
			type: "SET_PRICE",
			payload: price,
		});

		resetPriceRangeFilters();
	};

	const resetPriceFilters = () => {
		dispatch({
			type: "RESET_PRICE",
		});
	};

	const setPriceRangeFilters = (priceRange: PriceRange) => {
		dispatch({
			type: "SET_PRICE_RANGE",
			payload: priceRange,
		});

		resetPriceFilters();
	};

	const resetPriceRangeFilters = () => {
		dispatch({
			type: "RESET_PRICE_RANGE",
		});
	};

	useEffect(() => {
		if (!state.initialized) {
			initializeStore();
		} else if (state.params.toString() !== window.location.search) {
			updateURL(state.params);
			getProductsFromParams(state.params);
		}
	}, [state.params]); // eslint-disable-line react-hooks/exhaustive-deps

	const value = {
		state,
		loading,
		setLoading,
		error,
		setError,
		setSearchFilters,
		resetSearchFilters,
		setPageFilters,
		resetPageFilters,
		setCategoryFilters,
		resetCategoryFilters,
		setPriceFilters,
		resetPriceFilters,
		setPriceRangeFilters,
		resetPriceRangeFilters,
	};

	return <storeContext.Provider value={value}>{children}</storeContext.Provider>;
};

const useFilters = () => {
	const context = useContext(storeContext);
	if (context === undefined) {
		throw new Error("useFilters must be used within a FiltersProvider");
	}
	return context;
};

export { useFilters, FiltersProvider };
