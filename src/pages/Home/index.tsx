import { initialState } from "../../initialState";
import { Products } from "@components";
import { useStore } from "@context";

const Home = () => {
	const { products } = initialState;
	const { state } = useStore();
	console.log(state);

	return (
		<div>
			<Products products={products} />
		</div>
	);
};

export { Home };
