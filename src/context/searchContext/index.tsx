import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { getCategories, getProducts } from "@utils";
import { CategoryModel, ProductModel } from "@models";

type PriceRange = {
	min: number;
	max: number;
};

type SearchState = {
	initialized: boolean;
	categories: CategoryModel[];
	products: ProductModel[];
	params: URLSearchParams;
	page: number;
};

type SearchActions =
	| "INITIALIZE_SEARCH"
	| "UPDATE_PRODUCTS"
	| "UPDATE_CATEGORIES"
	| "SET_SEARCH"
	| "RESET_SEARCH"
	| "SET_PAGE"
	| "RESET_PAGE"
	| "SET_CATEGORY"
	| "RESET_CATEGORY"
	| "SET_PRICE"
	| "RESET_PRICE"
	| "SET_PRICE_RANGE"
	| "RESET_PRICE_RANGE"
	| "RESET_ALL";

type SearchAction = {
	type: SearchActions;
	payload?: any;
};

type SearchContextType = {
	state: SearchState;
	loading: boolean;
	setLoading: (payload: boolean) => void;
	error: string;
	setError: (payload: string) => void;
	setSearch: (payload: string) => void;
	resetSearch: () => void;
	setPage: (payload: number) => void;
	resetPage: () => void;
	setCategory: (payload: number) => void;
	getCategoryId: () => number;
	resetCategory: () => void;
	setPrice: (payload: number) => void;
	resetPrice: () => void;
	setPriceRange: (payload: PriceRange) => void;
	resetPriceRange: () => void;
	resetAll: () => void;
};

interface SearchMethod<Payload, Return> {
	(state: SearchState, payload: Payload): Return;
}

const paramsAvailables = {
	search: "search",
	page: "page",
	category: "category",
	price: "price",
	min: "min",
	max: "max",
};

const initialState: SearchState = {
	initialized: false,
	categories: [],
	products: [],
	params: new URLSearchParams(),
	page: 1,
};

const setSearchMethods: Record<string, SearchMethod<any, SearchState>> = {
	INITIALIZE_SEARCH: (state: SearchState, payload: SearchState) => {
		return { ...state, ...payload };
	},
	UPDATE_PRODUCTS: (state: SearchState, payload: ProductModel[]) => {
		return { ...state, products: payload };
	},
	UPDATE_CATEGORIES: (state: SearchState, payload: CategoryModel[]) => {
		return { ...state, categories: payload };
	},
	SET_SEARCH: (state: SearchState, payload: string) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.search, payload);
		return { ...state, params };
	},
	SET_PAGE: (state: SearchState, payload: number) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.page, payload.toString());
		return { ...state, params, page: payload };
	},
	SET_CATEGORY: (state: SearchState, payload: number) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.category, payload.toString());
		return { ...state, params };
	},
	SET_PRICE: (state: SearchState, payload: number) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.price, payload.toString());
		return { ...state, params };
	},
	SET_PRICE_RANGE: (state: SearchState, payload: PriceRange) => {
		const params = new URLSearchParams(state.params);
		params.set(paramsAvailables.min, payload.min.toString());
		params.set(paramsAvailables.max, payload.max.toString());
		return { ...state, params };
	},
};

const resetSearchMethods = (type: string, state: SearchState) => {
	const params = new URLSearchParams(state.params);
	let page = state.page;
	if (type.includes("page")) page = 1;
	if (params.get(type)) {
		params.delete(type);
	} else if (type.includes("price_range")) {
		params.delete(paramsAvailables.min);
		params.delete(paramsAvailables.max);
	}

	return { ...state, params, page };
};

const storeReducer = (state: SearchState, action: SearchAction) => {
	const { type, payload } = action;
	if (type.includes("RESET")) {
		const param = type.split("_")[1].toLowerCase();

		if (param === "all") {
			return initialState;
		}

		return resetSearchMethods(param, state);
	}

	return setSearchMethods[type](state, payload);
};

const storeContext = createContext<SearchContextType>({
	state: initialState,
	loading: true,
	setLoading: () => undefined,
	error: "",
	setError: () => undefined,
	setSearch: () => undefined,
	resetSearch: () => undefined,
	setPage: () => undefined,
	resetPage: () => undefined,
	setCategory: () => undefined,
	getCategoryId: () => 0,
	resetCategory: () => undefined,
	setPrice: () => undefined,
	resetPrice: () => undefined,
	setPriceRange: () => undefined,
	resetPriceRange: () => undefined,
	resetAll: () => undefined,
});

const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
			const products = await getProducts(params);
			dispatch({
				type: "UPDATE_PRODUCTS",
				payload: products,
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

	const getCategoriesList = async () => {
		try {
			const categories = await getCategories();
			dispatch({
				type: "UPDATE_CATEGORIES",
				payload: categories,
			});
		} catch (error) {
			let errorMessage = "An error has occurred fetching the categories.";
			if (error instanceof Error) {
				errorMessage = error.message;
			}
			setError(errorMessage);
		}
	};

	const initializeStore = async () => {
		setLoading(true);

		const params = getInitialParams();
		await getProductsFromParams(params);
		await getCategoriesList();

		dispatch({
			type: "INITIALIZE_SEARCH",
			payload: {
				params,
				initialized: true,
			},
		});
	};

	const setSearch = (search: string) => {
		dispatch({
			type: "SET_SEARCH",
			payload: search,
		});
		resetPage();
	};

	const resetSearch = () => {
		dispatch({
			type: "RESET_SEARCH",
		});
	};

	const setPage = (page: number) => {
		dispatch({
			type: "SET_PAGE",
			payload: page,
		});
	};

	const resetPage = () => {
		dispatch({
			type: "RESET_PAGE",
		});
	};

	const setCategory = (category: number) => {
		if (category === Number(state.params.get(paramsAvailables.category))) {
			resetCategory();
		} else {
			dispatch({
				type: "SET_CATEGORY",
				payload: category,
			});
		}
		resetPage();
	};

	const getCategoryId = () => {
		const categoryId = state.params.get(paramsAvailables.category);
		return categoryId ? Number(categoryId) : 0;
	};

	const resetCategory = () => {
		dispatch({
			type: "RESET_CATEGORY",
		});
	};

	const setPrice = (price: number) => {
		dispatch({
			type: "SET_PRICE",
			payload: price,
		});

		resetPriceRange();
	};

	const resetPrice = () => {
		dispatch({
			type: "RESET_PRICE",
		});
	};

	const setPriceRange = (priceRange: PriceRange) => {
		dispatch({
			type: "SET_PRICE_RANGE",
			payload: priceRange,
		});

		resetPrice();
	};

	const resetPriceRange = () => {
		dispatch({
			type: "RESET_PRICE_RANGE",
		});
	};

	const resetAll = () => {
		dispatch({
			type: "RESET_ALL",
		});
	};

	useEffect(() => {
		if (!state.initialized) {
			initializeStore();
		} else if (`?${state.params.toString()}` !== window.location.search) {
			updateURL(state.params);
			getProductsFromParams(state.params);
		} else {
			updateURL(state.params);
		}
	}, [state.params]); // eslint-disable-line react-hooks/exhaustive-deps

	const value = {
		state,
		loading,
		setLoading,
		error,
		setError,
		setSearch,
		resetSearch,
		setPage,
		resetPage,
		setCategory,
		getCategoryId,
		resetCategory,
		setPrice,
		resetPrice,
		setPriceRange,
		resetPriceRange,
		resetAll,
	};

	return <storeContext.Provider value={value}>{children}</storeContext.Provider>;
};

const useSearch = () => {
	const context = useContext(storeContext);
	if (context === undefined) {
		throw new Error("useSearch must be used within a SearchProvider");
	}
	return context;
};

export { useSearch, SearchProvider };
