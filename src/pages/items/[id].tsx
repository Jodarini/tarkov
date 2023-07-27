import { useRouter } from "next/router";
import { useQuery } from "react-query";
import type { UseQueryResult } from "react-query";
import Image from "next/image";
import { gql } from "graphql-request";
interface Item {
  data: {
    item: {
      id: string;
      name: string;
      shortName: string;
      description: string;
      fleaMarketFee: number;
      image512pxLink: string;
      wikiLink: string;
    };
  };
}

const GET_ITEM = gql`
  query ($itemId: ID!) {
    item(id: $itemId) {
      id
      name
      shortName
      description
      fleaMarketFee
      image512pxLink
      wikiLink
    }
  }
`;

const Items = () => {
  const router = useRouter();
  const item = router.query.id;

  const fetchItem = async (item: string) => {
    const res = await fetch("https://api.tarkov.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ITEM,
        variables: { itemId: item },
      }),
    });

    if (!res.ok) {
      throw new Error("An error ocurred");
    }

    return res.json();
  };

  const { isLoading, error, data }: UseQueryResult<Item> = useQuery(
    ["getItem", item],
    () => fetchItem(item as string)
  );

  const itemById = data?.data.item;

  return (
    <>
      <h3 className="mb-4 text-2xl font-bold text-slate-200">
        {itemById?.name}
      </h3>
      <div className="flex flex-col gap-4 md:flex-row">
        {isLoading && <>Loading...</>}
        {itemById && (
          <Image
            src={itemById.image512pxLink}
            width={100}
            className="max-h-[100px] max-w-[100px]"
            height={100}
            alt={itemById.name}
          />
        )}
        <div>
          <p>
            <strong>Short name: </strong>
            {isLoading && <>Loading...</>}
            {itemById?.shortName}
          </p>
          <p>
            <strong>Description: </strong>
            {isLoading && <>Loading...</>}
            {itemById?.description}
          </p>
          <p>
            <strong>Fleamarket fee: </strong>
            {isLoading && <>Loading...</>}
            {itemById?.fleaMarketFee}
          </p>
        </div>
      </div>
    </>
  );
};

export default Items;
