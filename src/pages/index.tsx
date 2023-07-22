import { SetStateAction, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import type { UseQueryResult } from "react-query";
import Link from "next/link";

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
export default function Home({}) {
  const router = useRouter();
  const limit = 10;
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    router.query.page && setPage(Number(router.query.page));
  }, [router.query.page]);

  const fetchItems = async (page: number) => {
    const offset = (page - 1) * limit;
    const response = await fetch("https://api.tarkov.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  const { isLoading, error, data }: UseQueryResult<Items> = useQuery(
    ["allItems", page],
    () => fetchItems(page)
  );

  console.count();

  const handleNextPage = () => {
    setPage((previousPage: number) => {
      const page = previousPage + 1;
      router
        .push({
          pathname: "",
          query: { page },
        })
        .catch((error) => {
          console.log(error);
        });
      return page;
    });
  };

  const handlePreviousPage = () => {
    setPage((previousPage: number) => {
      const page = previousPage - 1;
      router
        .push({
          pathname: "",
          query: { page },
        })
        .catch((error) => {
          console.log(error);
        });
      return page;
    });
  };

  if (error) return "an error ocurred: ";

  return (
    <>
      <h3 className="mb-4 text-2xl font-bold text-slate-200">Items</h3>
      <table className="border-collapse text-left">
        <thead>
          <tr>
            <th className="border-b border-slate-700 p-2">Short name</th>
            <th className="border-b border-slate-700 p-2">Description</th>
            <th className="border-b border-slate-700 p-2">Flea price</th>
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
              <tr className="border-b text-lg" key={item.id}>
                <Link href={`/items/${item.id}`}>
                  <td className="border-b border-slate-700 p-2">
                    {item.shortName}
                  </td>
                  <td className="border-b border-slate-700 p-2">{item.name}</td>
                  <td className="border-b border-slate-700 p-2">
                    {item.sellFor.map((price) => (
                      <span key={price.source}>
                        {price.source === "fleaMarket" &&
                          `${price.priceRUB}` + " ₽"}
                      </span>
                    ))}
                  </td>
                </Link>
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
