import "./App.css";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "react-query";
import { useState } from "react";

const apiEndPoint = "https://api.tarkov.dev/graphql";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="flex flex-col items-center ">
				<h1 className="text- text-4xl ">Tarkov API</h1>
				<MenuBar />
				<TarkovItems />
				<TarkovTraders />
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

function TarkovTraders() {
	const [tarkovTraders, setTarkovTraders] = useState([]);

	const allTraders = `query {
		traders {
			name,
			description,
			imageLink
		}
	}`;

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

	return (
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
	);
}

function TarkovItems() {
	const [tarkovItems, setTarkovItems] = useState([]);
	const [page, setPage] = useState(0);

	const itemsPerPage = 10;

	const allItems = `query ($page: Int, $itemsPerPage: Int) {
    items(limit: $itemsPerPage, offset: $page){
      id
      name
      shortName
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

	const nextPage = () => {
		setPage(prev => prev + 10);
	};

	const prevPage = () => {
		setPage(prev => prev - 10);
	};

	return (
		<div>
			All items
			{status === "success" ? (
				<>
					<ul>
						{tarkovItems.map((item: { id: string; name: string }) => (
							<li key={item.id}>{item.name}</li>
						))}
					</ul>
					<div className="flex flex-row justify-between gap-5 mt-5 font-bold">
						<a
							className="group flex items-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
							onClick={() => prevPage()}
						>
							<svg
								viewBox="0 0 3 6"
								className="mr-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
							>
								<path
									d="M3 0L0 3L3 6"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
							</svg>
							Previous
						</a>
						<a
							className="group flex items-center cursor-pointer hover:text-slate-900 dark:hover:text-white"
							onClick={() => nextPage()}
						>
							Next
							<svg
								viewBox="0 0 3 6"
								className="ml-3 w-auto h-1.5 text-slate-400 overflow-visible group-hover:text-slate-600 dark:group-hover:text-slate-300"
							>
								<path
									d="M0 0L3 3L0 6"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								></path>
							</svg>
						</a>
					</div>
				</>
			) : (
				"loading"
			)}
		</div>
	);
}
