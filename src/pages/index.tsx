import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { NextRouter, Router, useRouter } from "next/router";
import type { UseQueryResult } from "react-query";
import Link from "next/link";
import { gql } from "graphql-request";
import useNextAndPreviousPage from "~/hooks/useNextAndPreviousPage";

interface Items {
  data: {
    items: {
      id: number;
      name: string;
      shortName: string;
      description: string;
      sellFor: {
        source: string;
        priceRUB: number;
      }[];
    }[];
  };
}

const GET_ITEMS = gql`
  query ($limit: Int, $offset: Int) {
    items(limit: $limit, offset: $offset) {
      id
      name
      description
      shortName
      sellFor {
        priceRUB
        source
      }
    }
  }
`;

export default function Home({}) {
  return (
    <>
      <Items />
    </>
  );
}

const Items = () => {
  const router = useRouter();
  const limit = 10;
  const [page, setPage] = useState(1);

  const { handleNextPage, handlePreviousPage } = useNextAndPreviousPage(
    router,
    page
  );

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
        query: GET_ITEMS,
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
              <tr
                className="border-b text-lg hover:bg-slate-900/50"
                key={item.id}
              >
                <td className="border-b border-slate-700 p-2">
                  <Link href={`/items/${item.id}`} className="block">
                    {item.shortName}
                  </Link>
                </td>
                <td className="border-b border-slate-700 p-2">
                  <Link href={`/items/${item.id}`} className="block">
                    {item.name}
                  </Link>
                </td>
                <td className="border-b border-slate-700 p-2">
                  {item.sellFor.length === 0 && "n/a"}
                  {item.sellFor.map((price) => (
                    <Link
                      key={price.source}
                      href={`/items/${item.id}`}
                      className="block"
                    >
                      <span>
                        {!price && "n/a"}
                        {price.source === "" && "n/a"}
                        {price.source === "fleaMarket" &&
                          `${price.priceRUB}` + " ₽"}
                      </span>
                    </Link>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="mt-1 flex w-full justify-between">
        <button
          onClick={handlePreviousPage}
          className="min-w-[80px] rounded-md  bg-slate-900/50 p-2 text-white"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="min-w-[80px] rounded-md bg-slate-900/50 p-2 text-white"
        >
          Next
        </button>
      </div>
    </>
  );
};
