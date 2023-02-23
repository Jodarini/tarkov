import { useState } from "react";
import { useQuery } from "react-query";
const apiEndPoint = "https://api.tarkov.dev/graphql";

export default function TarkovItems() {
	const [tarkovItems, setTarkovItems] = useState([]);
	const [page, setPage] = useState(0);

	const itemsPerPage = 10;

	const allItems = `query ($page: Int, $itemsPerPage: Int) {
    	items(limit: $itemsPerPage, offset: $page){
			id
			name
			shortName
			iconLink
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
					<table>
						<thead>
							<tr role="row">
								<th></th>
								<th>ShortName</th>
								<th>Name</th>
							</tr>
						</thead>
						<tbody>
							{tarkovItems.map(
								(item: {
									id: string;
									name: string;
									shortName: string;
									iconLink: string;
								}) => (
									<tr className="border p-5" key={item.id}>
										<td>
											<img src={item.iconLink} alt="" />
										</td>
										<td className="p-2 border">{item.shortName}</td>
										<td className="p-2">{item.name}</td>
									</tr>
								)
							)}
						</tbody>
					</table>
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
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
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
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
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
