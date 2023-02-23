import { useState } from "react";
const apiEndPoint = "https://api.tarkov.dev/graphql";
import { useQuery } from "react-query";

export default function TarkovTraders() {
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
