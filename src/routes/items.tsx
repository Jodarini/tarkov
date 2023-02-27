import { useState } from "react";
import { useQuery } from "react-query";
import Skeleton, {
	SkeletonTheme,
} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const apiEndPoint = "https://api.tarkov.dev/graphql";
interface Items {
	id: string;
	name: string;
	shortName: string;
	iconLink: string;
}
export default function TarkovItems() {
	const [tarkovItems, setTarkovItems] = useState<
		Array<Items>
	>(Array(10).fill(0));

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
	const fetchItems = async () => {
		const response = await fetch(apiEndPoint, {
			method: "post",
			headers: {
				"Content-Type": "applicaton/json",
			},
			body: JSON.stringify({
				query: allItems,
				variables: {
					page,
					itemsPerPage,
				},
			}),
		});
		const data = await response.json();
		return data;
	};

	const { data, status } = useQuery(
		[allItems, page, itemsPerPage],
		fetchItems,
		{
			onSuccess: data => {
				setTarkovItems(data.data.items);
			},
		}
	);

	const nextPage = () => {
		setPage(prev => prev + 10);
	};

	const prevPage = () => {
		setPage(prev => prev - 10);
	};

	return (
		<div className="w-full">
			All items
			<table className="table-auto w-full">
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
							<SkeletonTheme baseColor="#212f4d" highlightColor="#324773">
								<tr className="border p-5 w-full" key={item.id}>
									<td className="w-14">
										{item.iconLink ? (
											<img src={item.iconLink} alt="" />
										) : (
											<Skeleton height={50} />
										)}
									</td>
									<td className="p-2 border w-20">
										{item.shortName || <Skeleton />}
									</td>
									<td className="p-2">{item.name || <Skeleton />}</td>
								</tr>
							</SkeletonTheme>
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
		</div>
	);
}
