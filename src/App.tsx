import "./App.css";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "react-query";
import { useEffect, useState } from "react";

const apiEndPoint = "https://api.tarkov.dev/graphql";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="flex flex-col items-center ">
				<h1 className="text- text-4xl ">Tarkov API</h1>
				<MenuBar />
				<TarkovList />
			</div>
		</QueryClientProvider>
	);
}

function MenuBar() {
	return (
		<ul className="gap-4 flex flex-row">
			<li>
				<a href="">Items</a>
			</li>
			<li>
				<a href="">Traders</a>
			</li>
		</ul>
	);
}

function TarkovList() {
	const [tarkovItems, setTarkovItems] = useState([]);
	const [tarkovTraders, setTarkovTraders] = useState([]);
	const [page, setPage] = useState(0);

	const itemsPerPage = 10;

	const allItems = `query ($page: Int, $itemsPerPage: Int) {
    items(limit: $itemsPerPage, offset: $page){
      id
      name
      shortName
    }
  	}`;

	const allTraders = `query {
		traders {
			name,
			description,
			imageLink
		}
	}`;

	const { data, status } = useQuery(
		[allItems, page, itemsPerPage],
		() => {
			fetch(apiEndPoint, {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: allItems,
					variables: {
						page,
						itemsPerPage,
					},
				}),
			})
				.then(res => res.json())
				.then(res => {
					setTarkovItems(res.data.items);
				});
		}
	);

	const { data: traderData, status: traderStatus } = useQuery(
		[allTraders],
		() => {
			fetch(apiEndPoint, {
				method: "post",
				headers: {
					"Content-Type": "applicaton/json",
				},
				body: JSON.stringify({
					query: allTraders,
				}),
			})
				.then(res => res.json())
				.then(res => {
					setTarkovTraders(res.data.traders);
				});
		}
	);

	const nextPage = () => {
		setPage(prev => prev + 10);
	};

	const prevPage = () => {
		setPage(prev => prev - 10);
	};

	return (
		<div>
			<div>
				All traders
				<table className="table-auto border-gray-200 border">
					<tbody>
						{tarkovTraders.map(
							(trader: {
								name: string;
								description: string;
								imageLink: string;
							}) => (
								<tr className="border " key={trader.name}>
									<th className="border">
										<img src={trader.imageLink} alt="trader image" />
										{trader.name}
									</th>
									<th className="border p-4 text-left font-light">
										{trader.description}
									</th>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
			All items
			{status === "success" ? (
				<>
					<ul>
						{tarkovItems.map((item: { id: string; name: string }) => (
							<li key={item.id}>{item.name}</li>
						))}
					</ul>
					<button onClick={() => prevPage()}>Prev</button>
					<button onClick={() => nextPage()}>Next</button>
				</>
			) : (
				"loading"
			)}
		</div>
	);
}
