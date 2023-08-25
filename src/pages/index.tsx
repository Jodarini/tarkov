import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { useQuery } from "react-query";
import type { UseQueryResult } from "react-query";

import { useRouter } from "next/router";
import Image from "next/image";

import useNextAndPreviousPage from "~/hooks/useNextAndPreviousPage";

import { debounce } from "lodash";

import { fetchItems, fetchTraders } from "~/services/fetch-api";

interface Item {
  data: {
    items: {
      id: number;
      name: string;
      shortName: string;
      description: string;
      baseImageLink: string;
      sellFor: SellFor[];
    }[];
  };
}

interface SellFor {
  source: string;
  priceRUB: number;
  price: number;
}

interface Traders {
  data: {
    traders: {
      name: string;
      imageLink: string;
      description: string;
    }[];
  };
}

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageQuery, setPageQuery] = useState<number>(1);

  useEffect(() => {
    const { search, page } = router.query;
    setSearchQuery(search ? String(search) : "");
    setPageQuery(page ? Number(page) : 1);
  }, [router.query]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    isLoading,
    data: itemData,
    refetch,
    isFetching,
  }: UseQueryResult<Item> = useQuery(
    ["allItems", pageQuery, searchQuery],
    () => fetchItems(pageQuery, searchQuery, limit),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: traderData }: UseQueryResult<Traders> = useQuery({
    queryKey: ["traders"],
    queryFn: fetchTraders,
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    router
      .push({
        query: { search: e.target.value, page: 1 },
      })
      .catch((error: string) => {
        throw new Error(error);
      });
  };

  const handleDebounceSearch = debounce(handleSearch, 800);
  useEffect(() => {
    searchInputRef.current && searchInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = searchQuery || "";
    }

    const refetchQuery = async () => {
      await refetch();
    };

    refetchQuery().catch((error: string) => {
      throw new Error(error);
    });
  }, [searchQuery, refetch]);

  const { handleNextPage, handlePreviousPage } = useNextAndPreviousPage(
    router,
    pageQuery
  );

  const items = itemData?.data.items;
  const traders = traderData?.data.traders;

  const hasFleaMarketPrice = (item: SellFor[]): boolean => {
    return !item.some(({ source }) => source === "fleaMarket");
  };

  const highestPrice = (item: SellFor[]) => {
    let bestPrice = 0;
    let bestVendor = "";

    item.forEach(({ price, source }) => {
      if (source === "fleaMarket") return;

      if (bestPrice < price) {
        bestPrice = price;
        bestVendor = source;
      }
    });
    const bestVendorData = traders?.find(
      (trader) => trader.name.toLowerCase() === bestVendor
    );
    return {
      bestVendorLink: bestVendorData?.imageLink as string,
      bestVendorName: bestVendorData?.name as string,
      bestPrice,
    };
  };

  return (
    <>
      <div className="mb-4 flex flex-row items-center "></div>
      <form>
        <div className="relative">
          <input
            autoFocus
            ref={searchInputRef}
            type="text"
            placeholder={isFetching ? "fetching..." : "Search items"}
            className="w-full border-b border-b-slate-700 bg-slate-800/50 p-2 placeholder-slate-300"
            onChange={handleDebounceSearch}
          />
        </div>
      </form>
      <div className="max-w-full overflow-x-scroll">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="md:text-md text-sm">
              <th className="border-b border-slate-700 p-2 text-slate-200/90">
                Name
              </th>
              <th className="border-b border-slate-700 p-2 text-slate-200/90">
                Description
              </th>
              <th className="border-b border-slate-700 p-2 text-slate-200/90">
                Flea price
              </th>
              <th className="border-b border-slate-700 p-2 text-slate-200/90">
                Best sold to
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
                    {item.sellFor.map((price) => (
                      <span key={price.source}>
                        {price.source.includes("fleaMarket") &&
                          `${price.priceRUB} ₽`}
                      </span>
                    ))}
                    <span title="This item can't be sold on the flea market">
                      {hasFleaMarketPrice(item.sellFor) && "✖️"}
                    </span>
                  </td>
                  <td className="border-b border-slate-700 p-2 text-slate-200/90">
                    {!highestPrice(item.sellFor).bestVendorLink ? (
                      <span title="This item is not sold by any vendor">
                        ✖️
                      </span>
                    ) : (
                      <span
                        className="flex flex-col text-center md:flex-row"
                        title={`${highestPrice(item.sellFor).bestVendorName}`}
                      >
                        {highestPrice(item.sellFor).bestVendorLink && (
                          <Image
                            src={highestPrice(item.sellFor).bestVendorLink}
                            width={50}
                            height={50}
                            className="max-h-[25px] min-h-[25px] self-center object-contain"
                            alt={`${item.shortName}' grid image'`}
                          />
                        )}
                        {`${highestPrice(item.sellFor).bestPrice} ₽`}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            {items?.length === 0 && (
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
