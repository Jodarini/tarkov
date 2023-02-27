import { useState } from "react";
const apiEndPoint = "https://api.tarkov.dev/graphql";
import { useQuery } from "react-query";
import Skeleton, {
	SkeletonTheme,
} from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Trader {
	name: string;
	description: string;
	imageLink: string;
}

export default function TarkovTraders() {
	const [tarkovTraders, setTarkovTraders] = useState<
		Array<Trader>
	>(Array(10).fill(0));

	const allTraders = `query {
		traders {
			name,
			description,
			imageLink
		}
	}`;

	const fetchTraders = async () => {
		const response = await fetch(apiEndPoint, {
			method: "post",
			headers: {
				"Content-Type": "applicaton/json",
			},
			body: JSON.stringify({
				query: allTraders,
			}),
		});
		const data = await response.json();
		return data;
	};

	const { data: traderData, status: traderStatus } = useQuery(
		[allTraders],
		fetchTraders,
		{
			onSuccess: data => {
				setTarkovTraders(data.data.traders);
			},
		}
	);

	return (
		<div className="w-full">
			All traders
			{traderStatus === "error" && <div>Error fetching data</div>}
			<table className="table-auto border-gray-200 border w-full">
				<tbody>
					{tarkovTraders.map(
						(trader: {
							name: string;
							description: string;
							imageLink: string;
						}) => (
							<SkeletonTheme baseColor="#212f4d" highlightColor="#324773">
								<tr className="border w-full" key={trader.name}>
									<td className="border w-[90px] h-[115px] text-center">
										{trader.imageLink ? (
											<img src={trader.imageLink} alt="trader image" />
										) : (
											<Skeleton height={85} />
										)}

										{trader.name || <Skeleton />}
									</td>
									<td className="border p-4 text-left font-light">
										{trader.description || <Skeleton count={4} />}
									</td>
								</tr>
							</SkeletonTheme>
						)
					)}
				</tbody>
			</table>
		</div>
	);
}
