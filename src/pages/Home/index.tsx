import { Products } from "@components";
import { useStore } from "@context";

const Home = () => {
	const {
		state: { products },
	} = useStore();

	return (
		<div>
			<Products products={products} />
		</div>
	);
};

export { Home };
