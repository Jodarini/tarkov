import "./App.css";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "react-query";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="App flex flex-col align-middle justify-center justify-items-center w-full">
				<h1 className="text-cyan-800">Tarkov</h1>
				<TarkovList />
			</div>
		</QueryClientProvider>
	);
}

function TarkovList() {
	const [tarkovItems, setTarkovItems] = useState([]);
	const [page, setPage] = useState(0);

	const itemsPerPage = 10;

	const firstQuery = `query ($page: Int, $itemsPerPage: Int) {
    items(limit: $itemsPerPage, offset: $page){
      id
      name
      shortName
    }
  }`;
	const { data, status } = useQuery(
		[firstQuery, page, itemsPerPage],
		() => {
			fetch("https://api.tarkov.dev/graphql", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: firstQuery,
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

	if (status === "loading") {
		return <h1>loading</h1>;
	}

	const nextPage = () => {
		setPage(prev => prev + 10);
		console.log(page);
	};

	const prevPage = () => {
		setPage(prev => prev - 10);
		console.log(page);
	};
	return (
		<div>
			Tarkov List
			<ul>
				{tarkovItems.map((item: { id: string; name: string }) => (
					<li key={item.id}>{item.name}</li>
				))}
			</ul>
			<button onClick={() => prevPage()}>Prev</button>
			<button onClick={() => nextPage()}>Next</button>
		</div>
	);
}
