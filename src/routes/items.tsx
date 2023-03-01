import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Skeleton, {
	SkeletonTheme,
} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";

const API_ENDPOINT = "https://api.tarkov.dev/graphql";
const PAGE_SIZE = 10;

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
	const navigate = useNavigate();

	const { page } = useParams();

	useEffect(() => {
		if (page) {
			setCurrentPage(parseInt(page, 10));
		} else {
			setCurrentPage(1);
		}
	}, [page]);

	console.log("current page: ", page);
	const [currentPage, setCurrentPage] = useState(1);

	const allItems = `query ($page: Int, $itemsPerPage: Int) {
    	items(limit: $itemsPerPage, offset: $page){
			id
			name
			shortName
			iconLink
			}
  	}`;

	const fetchItems = async (page: number) => {
		const response = await fetch(API_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "applicaton/json",
			},
			body: JSON.stringify({
				query: allItems,
				variables: {
					page: (page - 1) * PAGE_SIZE,
					itemsPerPage: PAGE_SIZE,
				},
			}),
		});
		const data = await response.json();
		return data;
	};

	const { data, status } = useQuery(
		["items", currentPage],
		() => fetchItems(currentPage),
		{
			onSuccess: data => {
				setTarkovItems(data.data.items);
			},
		}
	);

	const nextPage = () => {
		setCurrentPage(prev => prev + 1);
		navigate(`/items/${currentPage + 1}`);
	};

	const prevPage = () => {
		setCurrentPage(prev => prev - 1);
		navigate(`/items/${currentPage - 1}`);
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
										{item.iconLink && status === "success" ? (
											<img src={item.iconLink} alt="" />
										) : (
											<Skeleton height={50} />
										)}
									</td>
									<td className="p-2 border w-20">
										{item.shortName && status === "success" ? (
											item.shortName
										) : (
											<Skeleton />
										)}
									</td>
									<td className="p-2">
										{item.name && status === "success" ? (
											item.name
										) : (
											<Skeleton />
										)}
									</td>
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
