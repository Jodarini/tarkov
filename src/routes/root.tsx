import { Link, Outlet } from "react-router-dom";

export default function Root() {
	return (
		<>
			<div id="sidebar">
				<div className="flex flex-col items-center ">
					<h1 className="text- text-4xl ">Tarkov API Consumption</h1>
					<nav className="">
						<ul className="flex flex-row items-center gap-5">
							<li>
								<Link to={`/items`}>Items</Link>
							</li>
							<li>
								<Link to={`/traders`}>Traders</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
			<div id="detail">
				<Outlet />
			</div>
		</>
	);
}
