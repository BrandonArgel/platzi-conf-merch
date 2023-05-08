import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "@hooks";
import { Product } from "@models";

type StoreState = {
	cart: Product[];
	cartItems: number;
};

type StoreActions = "INITIALIZE_STORE" | "ADD_TO_CART" | "REMOVE_FROM_CART";

type StoreAction = {
	type: StoreActions;
	payload?: any;
};

type StoreContextType = {
	state: StoreState;
	addToCart: (payload: Product) => void;
	removeFromCart: (payload: Product) => void;
};

const initialState: StoreState = {
	cart: [],
	cartItems: 0,
};

const storeMethods = {
	INITIALIZE_STORE: (state: StoreState, payload: StoreState) => {
		return { ...state, ...payload };
	},
	ADD_TO_CART: (state: StoreState, payload: Product) => {
		const cart = [...state.cart, payload];
		return { ...state, cart, cartItems: cart.length };
	},
	REMOVE_FROM_CART: (state: StoreState, payload: Product) => {
		const cart = state.cart.filter((item) => item.id !== payload.id);
		return { ...state, cart, cartItems: cart.length };
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

	const initializeStore = (payload: StoreState) => {
		dispatch({ type: "INITIALIZE_STORE", payload });
	};

	const addToCart = (payload: Product) => {
		dispatch({ type: "ADD_TO_CART", payload });
	};

	const removeFromCart = (payload: Product) => {
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
