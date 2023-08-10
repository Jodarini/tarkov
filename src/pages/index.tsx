import { useEffect, useRef } from "react";
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
        price: number;
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
        source
        priceRUB
        price
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
  let searchQuery = "";
  let pageQuery = 1;
  if (router.query.search) {
    searchQuery = String(router.query.search);
  }
  if (router.query.page) {
    pageQuery = Number(router.query.page);
  }
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = searchQuery || "";
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

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

  const { isLoading, error, data, refetch, isFetching }: UseQueryResult<Items> =
    useQuery(
      ["allItems", pageQuery, searchQuery],
      () => fetchItems(pageQuery, searchQuery),
      {
        refetchOnWindowFocus: false,
      }
    );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    router
      .push({
        query: { search: value, page: 1 },
      })
      .catch((error: string) => {
        throw new Error(error);
      });
  };

  const handleDebounceSearch = debounce(handleSearch, 800);

  useEffect(() => {
    const refetchQuery = async () => {
      await refetch();
    };

    refetchQuery().catch((error: string) => {
      throw new Error(error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const { handleNextPage, handlePreviousPage } = useNextAndPreviousPage(
    router,
    pageQuery
  );

  if (error) return "an error ocurred: ";
  const items = data?.data.items;

  return (
    <>
      <div className="mb-4 flex flex-row items-center "></div>
      <form>
        <div className="relative">
          <input
            autoFocus
            ref={searchInputRef}
            type="text"
            placeholder="Search items..."
            className="w-full border-b border-b-slate-700 bg-slate-800/50 p-2 placeholder-slate-300"
            onChange={handleDebounceSearch}
          />
          {isFetching && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-normal opacity-60">
              fetching...
            </span>
          )}
        </div>
      </form>
      <div className="max-w-full overflow-x-scroll">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="md:text-md text-sm">
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
                  className="cursor-pointer border-b text-sm hover:bg-slate-900/50 active:bg-slate-900/50 md:text-lg"
                  key={item.id}
                  tabIndex={0}
                  role="link"
                  onClick={() => {
                    router.push(`/items/${item.id}`).catch((error: string) => {
                      throw new Error(error);
                    });
                  }}
                  onKeyDown={(e) => {
                    e.key === "Enter" &&
                      router
                        .push(`/items/${item.id}`)
                        .catch((error: string) => {
                          throw new Error(error);
                        });
                  }}
                >
                  <td className="min-w-fit border-b border-slate-700 p-2 text-center text-slate-200/90">
                    <div className="flex flex-col place-items-center md:flex-row md:gap-2">
                      <Image
                        src={item.baseImageLink}
                        width={50}
                        height={50}
                        className="max-h-[50px] min-h-[50px] self-center object-contain"
                        alt={`${item.shortName}' grid image'`}
                      />
                      {item.shortName}
                    </div>
                  </td>
                  <td className="border-b border-slate-700 p-2 text-slate-200/90">
                    {item.name}
                  </td>
                  <td className="border-b border-slate-700 p-2 text-slate-200/90">
                    {item.sellFor.length === 0 && "✖️"}
                    {item.sellFor.map((price) => (
                      <span key={price.source}>
                        {!price && "✖️"}
                        {price.source === "" && "✖️"}
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
      </div>

      <div className="mt-1 flex w-full justify-between">
        <button
          onClick={handlePreviousPage}
          className="min-w-[80px] rounded-md bg-slate-500 bg-opacity-20 p-2 font-semibold text-white hover:bg-slate-900/50 focus:bg-slate-900/50 active:bg-slate-900/50 disabled:bg-slate-900/50 disabled:opacity-30"
          disabled={pageQuery === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="min-w-[80px] rounded-md bg-slate-500 bg-opacity-20 p-2 font-semibold text-white hover:bg-slate-900/50 focus:bg-slate-900/50 active:bg-slate-900/50"
        >
          Next
        </button>
      </div>
    </>
  );
};
