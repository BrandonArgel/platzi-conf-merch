import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Checkout, Information, NotFound, Payment, Success, Product } from "@pages";
import { HomeContainer, Layout } from "@containers";
import { StoreProvider } from "@context";

const App = () => {
	return (
		<StoreProvider>
			<BrowserRouter>
				<Suspense fallback={<Loader />}>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<HomeContainer />} />
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
	);
};

const Loader = () => <>Cargando...</>;

export default App;
