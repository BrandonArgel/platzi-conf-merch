import { Outlet } from "react-router-dom";
import { Header } from "@components";

export const Layout = () => {
	return (
		<>
			<Header />
			<main>
				<Outlet />
			</main>
			<footer>Footer</footer>
		</>
	);
};
