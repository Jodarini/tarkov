import { useEffect, useState, useRef } from "react";
import type { ChangeEvent } from "react";

import { useQuery } from "react-query";
import type { UseQueryResult } from "react-query";

import { useRouter } from "next/router";
import Image from "next/image";

import { gql } from "graphql-request";

import useNextAndPreviousPage from "~/hooks/useNextAndPreviousPage";

import { debounce } from "lodash";

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
  const initialSearch = router.query.search as string; // Initialize with an empty string
  const [search, setSearch] = useState(initialSearch); // Use state for search
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearch(initialSearch);
    if (searchInputRef.current) {
      searchInputRef.current.value = initialSearch || "";
    }
  }, [initialSearch]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    router.query.page && setPage(Number(router.query.page));
  }, [router.query.page]);

  const fetchItems = async (page: number, searchQuery: string | undefined) => {
    if (searchQuery === null || searchQuery === "") searchQuery = undefined;
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
          name: searchQuery,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("An error occurred");
    }
    return response.json();
  };

  const {
    isLoading,
    isRefetching,
    error,
    data,
    refetch,
  }: UseQueryResult<Items> = useQuery(
    ["allItems", page, search],
    () => fetchItems(page, search),
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    void refetchQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    let value: string | undefined = e.target.value;
    if (value.length < 1) value = undefined;
    void router.push({
      query: { search: value, page: 1 },
    });
  };

  const handleDebounceSearch = debounce(handleSearch, 800);

  const refetchQuery = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const { handleNextPage, handlePreviousPage } = useNextAndPreviousPage(
    router,
    page
  );

  if (error) return "an error ocurred: ";
  const items = data?.data.items;

  return (
    <>
      <div className="mb-4 flex flex-row items-center gap-4">
        <h3 className="text-2xl font-bold text-slate-200/90">
          Items
          <span className="text-sm font-normal opacity-60">
            {isRefetching && `(Refetching)`}
          </span>
        </h3>
      </div>
      <form>
        <input
          autoFocus
          ref={searchInputRef}
          type="text"
          placeholder="Search items..."
          className="w-full border-b border-b-slate-700 bg-slate-800/50 p-2 placeholder-slate-300"
          onChange={handleDebounceSearch}
        />
      </form>
      <table className="border-collapse text-left">
        <thead>
          <tr>
            <th className="border-b border-slate-700 p-2 text-slate-200/90">
              Short name
            </th>
            <th className="border-b border-slate-700 p-2 text-slate-200/90">
              Description
            </th>
            <th className="border-b border-slate-700 p-2 text-slate-200/90">
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
          {items &&
            items.map((item) => (
              <tr
                className="cursor-pointer border-b text-lg hover:bg-slate-900/50 active:bg-slate-900/50"
                key={item.id}
                tabIndex={0}
                role="link"
                onClick={() => {
                  void router.push(`/items/${item.id}`);
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" && void router.push(`/items/${item.id}`)
                }
              >
                <td className="border-b border-slate-700 p-2 text-slate-200/90">
                  <div className="flex place-items-center gap-2">
                    <Image
                      src={item.baseImageLink}
                      width={50}
                      height={50}
                      className="max-w-auto max-h-auto"
                      alt={`${item.shortName}' grid image'`}
                    />
                    {item.shortName}
                  </div>
                </td>
                <td className="border-b border-slate-700 p-2 text-slate-200/90">
                  {item.name}
                </td>
                <td className="border-b border-slate-700 p-2 text-slate-200/90">
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
            ))}
          {data?.data.items.length === 0 && (
            <tr>
              <td>no items found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-1 flex w-full justify-between">
        <button
          onClick={handlePreviousPage}
          className="min-w-[80px] rounded-md p-2 font-bold text-white"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="min-w-[80px] rounded-md p-2 font-bold text-white"
        >
          Next
        </button>
      </div>
    </>
  );
};
