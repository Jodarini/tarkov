import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

import { useQuery } from "react-query";
import type { UseQueryResult } from "react-query";

import { useRouter } from "next/router";
import Image from "next/image";

import { gql } from "graphql-request";

import useNextAndPreviousPage from "~/hooks/useNextAndPreviousPage";

interface Items {
  data: {
    items: {
      id: number;
      name: string;
      shortName: string;
      description: string;
      baseImageLink: string;
      sellFor: {
        source: string;
        priceRUB: number;
      }[];
    }[];
  };
}

const GET_ITEMS = gql`
  query ($limit: Int, $offset: Int, $name: [String]) {
    items(limit: $limit, offset: $offset, names: $name) {
      id
      name
      shortName
      description
      baseImageLink
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
  const [searchParams, setSearchParams] = useState<string>();

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
          name: searchParams,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("An error occurred");
    }

    return response.json();
  };

  const { isLoading, error, data, refetch }: UseQueryResult<Items> = useQuery(
    ["allItems", page],
    () => fetchItems(page)
  );

  const updateURLParams = async () => {
    try {
      // await router.push({ query: { search: searchParams } });
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void updateURLParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    let value: string | undefined = e.target.value;
    if (value.length < 1) value = undefined;
    setSearchParams(value);
  };

  if (error) return "an error ocurred: ";

  return (
    <>
      <h3 className="mb-4 text-2xl font-bold text-slate-200">Items</h3>
      <form>
        <input
          type="text"
          placeholder="search..."
          value={searchParams || ""}
          className="text-slate-800"
          onChange={handleSearch}
        />
      </form>
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
          {(data &&
            data.data !== null &&
            data.data.items.map((item) => (
              <tr
                className="cursor-pointer border-b text-lg hover:bg-slate-900/50"
                key={item.id}
                role="link"
                onClick={() => {
                  void router.push(`/items/${item.id}`);
                }}
              >
                <td className="border-b border-slate-700 p-2">
                  <div className="flex place-items-center gap-2">
                    <Image
                      src={item.baseImageLink}
                      width={50}
                      className="max-h-[100px] max-w-[100px]"
                      height={50}
                      alt={`${item.shortName}' grid image'`}
                    />
                    {item.shortName}
                  </div>
                </td>
                <td className="border-b border-slate-700 p-2">{item.name}</td>
                <td className="border-b border-slate-700 p-2">
                  {item.sellFor.length === 0 && "n/a"}
                  {item.sellFor.map((price) => (
                    <span key={price.source}>
                      {!price && "n/a"}
                      {price.source === "" && "n/a"}
                      {price.source === "fleaMarket" &&
                        `${price.priceRUB}` + " ₽"}
                    </span>
                  ))}
                </td>
              </tr>
            ))) || (
            <tr>
              <td>no data found</td>
            </tr>
          )}
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
