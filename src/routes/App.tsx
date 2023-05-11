import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Checkout, Home, Information, NotFound, Payment, Success } from "@pages";
import { Layout } from "@components";
import { StoreProvider, FiltersProvider } from "@context";

const App = () => {
	return (
		<FiltersProvider>
			<StoreProvider>
				<BrowserRouter>
					<Suspense fallback={<Loader />}>
						<Routes>
							<Route path="/" element={<Layout />}>
								<Route index element={<Home />} />
								<Route path="/checkout" element={<Checkout />} />
								<Route path="/checkout/information" element={<Information />} />
								<Route path="/checkout/payment" element={<Payment />} />
								<Route path="/checkout/success" element={<Success />} />
							</Route>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Suspense>
				</BrowserRouter>
			</StoreProvider>
		</FiltersProvider>
	);
};

const Loader = () => <>Cargando...</>;

export default App;
