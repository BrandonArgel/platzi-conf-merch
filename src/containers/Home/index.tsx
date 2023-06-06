import { SearchProvider } from "@context";
import { Home } from "@pages";

export const HomeContainer = () => {
	return (
		<SearchProvider>
			<Home />
		</SearchProvider>
	);
};
