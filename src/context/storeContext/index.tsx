import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "@hooks";
import { ProductModel } from "@models";

type StoreState = {
	cart: ProductModel[];
	cartCounter: number;
};

type StoreActions = "INITIALIZE_STORE" | "ADD_TO_CART" | "REMOVE_FROM_CART";

type StoreAction = {
	type: StoreActions;
	payload?: any;
};

type StoreContextType = {
	state: StoreState;
	addToCart: (payload: ProductModel) => void;
	removeFromCart: (payload: number) => void;
};

const initialState: StoreState = {
	cart: [],
	cartCounter: 0,
};

const storeMethods = {
	INITIALIZE_STORE: (state: StoreState, payload: StoreState) => {
		return { ...state, ...payload };
	},
	ADD_TO_CART: (state: StoreState, payload: ProductModel) => {
		const cart = [...state.cart, payload];
		return { ...state, cart, cartCounter: cart.length };
	},
	REMOVE_FROM_CART: (state: StoreState, payload: number) => {
		const cart = state.cart.filter((_, index) => index !== payload);
		return { ...state, cart, cartCounter: cart.length };
	},
};

const storeReducer = (state: StoreState, action: StoreAction) => {
	const { type, payload } = action;
	return storeMethods[type](state, payload);
};

const storeContext = createContext<StoreContextType>({
	state: initialState,
	addToCart: () => undefined,
	removeFromCart: () => undefined,
});

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(storeReducer, initialState);
	const [storedValue, setStoredValue] = useLocalStorage<StoreState>("store", initialState);

	const initializeStore = async (payload: StoreState) => {
		dispatch({ type: "INITIALIZE_STORE", payload });
	};

	const addToCart = (payload: ProductModel) => {
		dispatch({ type: "ADD_TO_CART", payload });
	};

	const removeFromCart = (payload: number) => {
		dispatch({ type: "REMOVE_FROM_CART", payload });
	};

	useEffect(() => {
		initializeStore(storedValue);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setStoredValue(state);
	}, [state]); // eslint-disable-line react-hooks/exhaustive-deps

	const value = {
		state,
		addToCart,
		removeFromCart,
	};

	return <storeContext.Provider value={value}>{children}</storeContext.Provider>;
};

const useStore = () => {
	const context = useContext(storeContext);
	if (context === undefined) {
		throw new Error("useStore must be used within a StoreProvider");
	}
	return context;
};

export { useStore, StoreProvider };
