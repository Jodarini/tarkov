export default function Root() {
	return (
		<>
			<div id="sidebar">
				<nav>
					<ul>
						<li>
							<a href={`/items`}>Items</a>
						</li>
						<li>
							<a href={`/traders`}>Traders</a>
						</li>
					</ul>
				</nav>
			</div>
			<div id="detail"></div>
		</>
	);
}
