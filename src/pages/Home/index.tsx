import { Product } from "@components";
import { Products } from "@containers";
import { useFilters } from "@context";

const Home = () => {
	const {
		state: { products },
	} = useFilters();

	return (
		<div>
			<Products>
				{products && products.map((product) => <Product key={product.id} {...product} />)}
			</Products>
		</div>
	);
};

export { Home };
