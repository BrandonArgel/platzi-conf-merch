import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Checkout, Home, Information, NotFound, Payment, Success, Product } from "@pages";
import { Layout } from "@containers";
import { StoreProvider, SearchProvider } from "@context";

const App = () => {
	return (
		<SearchProvider>
			<StoreProvider>
				<BrowserRouter>
					<Suspense fallback={<Loader />}>
						<Routes>
							<Route path="/" element={<Layout />}>
								<Route index element={<Home />} />
								<Route path="/:id" element={<Product />} />
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
		</SearchProvider>
	);
};

const Loader = () => <>Cargando...</>;

export default App;
