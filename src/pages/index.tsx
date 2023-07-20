import { useState } from "react";
import { useQuery } from "react-query";
import type { UseQueryResult } from "react-query";

interface Items {
  data: {
    items: {
      id: number;
      name: string;
      shortName: string;
      sellFor: {
        source: string;
        priceRUB: number;
      }[];
    }[];
  };
}
export default function Home() {
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const fetchItems = async () => {
    const response = await fetch("https://api.tarkov.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `
        query allItems($limit: Int, $offset: Int){
            items (limit: $limit, offset: $offset ) {
              id
              name
              shortName
              sellFor  {
                priceRUB
                source
              }
            }
          }
        `,
        variables: {
          limit: limit,
          offset: offset,
        },
      }),
    });
    if (!response.ok) {
      throw new Error("An error occurred");
    }
    return response.json();
  };

  const { isLoading, error, data }: UseQueryResult<Items> = useQuery({
    queryKey: ["allItems", limit, offset],
    queryFn: fetchItems,
  });

  const handleNextPage = () => {
    setOffset(offset + 10);
  };

  const handlePreviousPage = () => {
    setOffset(offset - 10);
  };

  if (error) return "an error ocurred: ";

  return (
    <>
      <h3 className="text-2xl font-bold">Items</h3>
      <table className="border-collapse border border-slate-600">
        <thead>
          <tr>
            <th className="border-collapse border border-slate-600">
              Short name
            </th>
            <th className="border-collapse border border-slate-600">
              Description
            </th>
            <th className="border-collapse border border-slate-600">
              Flea price
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td>loading...</td>
            </tr>
          )}
          {data &&
            data.data.items.map((item) => (
              <tr
                className="border-collapse border border-slate-600 text-lg"
                key={item.id}
              >
                <td className="border-collapse border border-slate-600">
                  {item.shortName}
                </td>
                <td className="border-collapse border border-slate-600">
                  {item.name}
                </td>
                <td className="border-collapse border border-slate-600">
                  {item.sellFor.map((price) => (
                    <span key={price.source}>
                      {price.source === "fleaMarket" &&
                        `${price.priceRUB}` + " ₽"}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="mt-1 flex w-full justify-between">
        <button
          onClick={handlePreviousPage}
          className="min-w-[80px] rounded-md bg-white/10 p-2 text-white"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="min-w-[80px] rounded-md bg-white/10 p-2 text-white"
        >
          Next
        </button>
      </div>
    </>
  );
}
