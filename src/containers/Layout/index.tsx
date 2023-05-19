import { Outlet } from "react-router-dom";
import { useStore, useSearch } from "@context";
import { Footer, Header } from "@components";

export const Layout = () => {
	const {
		state: { cartCounter },
	} = useStore();

	const { resetAll } = useSearch();

	return (
		<>
			<Header counter={cartCounter} resetSearch={resetAll} />
			<main>
				<Outlet />
			</main>
			<Footer />
		</>
	);
};
