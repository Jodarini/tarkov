import { Link, Outlet } from "react-router-dom";

export default function Root() {
	return (
		<div className="flex flex-col w-full items-center p-6">
			<div id="sidebar">
				<div className="flex flex-col items-center ">
					<h1 className="text- text-4xl ">Tarkov API Consumption</h1>
					<nav className="">
						<ul className="flex flex-row items-center gap-5">
							<li>
								<Link to={`/items/1`}>Items</Link>
							</li>
							<li>
								<Link to={`/traders`}>Traders</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
			<div className="flex flex-col w-full md:w-2/3 justify-center align-middle items-center">
				<Outlet />
			</div>
		</div>
	);
}
