import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div>
			<h1>404</h1>
			<button onClick={() => navigate("/")}>Volver al inicio</button>
		</div>
	);
};

export { NotFound };
