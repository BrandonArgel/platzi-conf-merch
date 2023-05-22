import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "@hooks";
import { Alert } from "@components";
import { CartModel } from "@models";

type StoreState = {
	cart: CartModel[];
	cartCounter: number;
	cartTotal: number;
};

type StoreActions = "INITIALIZE_STORE" | "ADD_TO_CART" | "REMOVE_FROM_CART" | "UPDATE_PRODUCT";

type StoreAction = {
	type: StoreActions;
	payload?: any;
};

type StoreContextType = {
	state: StoreState;
	addToCart: (payload: CartModel) => void;
	removeFromCart: (payload: number) => void;
	updateProduct: (payload: CartModel) => void;
};

const initialState: StoreState = {
	cart: [],
	cartCounter: 0,
	cartTotal: 0,
};

const calculateCartTotal = (cart: CartModel[]) => {
	return cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
};

const updateCart = (state: StoreState, cart: CartModel[]) => ({
	...state,
	cart,
	cartCounter: cart.length,
	cartTotal: calculateCartTotal(cart),
});

const storeMethods = {
	INITIALIZE_STORE: (state: StoreState, payload: StoreState) => {
		return { ...state, ...payload };
	},
	ADD_TO_CART: (state: StoreState, payload: CartModel) => {
		const cart = [...state.cart];
		const indexInCart = cart.findIndex((item) => item.id === payload.id);
		if (~indexInCart) {
			const newTotal = cart[indexInCart].quantity + payload.quantity;
			if (newTotal > payload.stock) {
				Alert.fire({
					icon: "error",
					title: `There are only ${payload.stock} ${payload.title} left in stock.`,
				});

				cart[indexInCart].quantity = payload.stock;

				return updateCart({ ...state }, [...cart]);
			} else {
				Alert.fire({
					icon: "success",
					title: `You added ${payload.quantity} more ${payload.title} to cart, total ${newTotal}.`,
				});

				cart[indexInCart].quantity += payload.quantity;

				return updateCart({ ...state }, [...cart]);
			}
		} else {
			cart.push(payload);

			Alert.fire({
				icon: "success",
				title: `${payload.title} added to cart.`,
			});

			return updateCart({ ...state }, [...cart]);
		}
	},
	REMOVE_FROM_CART: (state: StoreState, payload: number) => {
		const cart = state.cart.filter((_, index) => index !== payload);

		Alert.fire({
			icon: "success",
			title: `${state.cart[payload].title} removed from cart.`,
		});

		return updateCart({ ...state }, [...cart]);
	},
	UPDATE_PRODUCT: (state: StoreState, payload: CartModel) => {
		const cart = state.cart.map((item) => {
			if (item.id === payload.id) {
				return payload;
			}
			return item;
		});

		Alert.fire({
			icon: "success",
			title: "Product updated.",
		});

		return updateCart({ ...state }, [...cart]);
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
	updateProduct: () => undefined,
});

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(storeReducer, initialState);
	const [storedValue, setStoredValue] = useLocalStorage<StoreState>("store", initialState);

	const initializeStore = async (payload: StoreState) => {
		dispatch({ type: "INITIALIZE_STORE", payload });
	};

	const addToCart = (payload: CartModel) => {
		dispatch({ type: "ADD_TO_CART", payload });
	};

	const removeFromCart = (payload: number) => {
		dispatch({ type: "REMOVE_FROM_CART", payload });
	};

	const updateProduct = (payload: CartModel) => {
		dispatch({ type: "UPDATE_PRODUCT", payload });
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
		updateProduct,
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
