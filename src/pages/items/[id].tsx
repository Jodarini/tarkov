import { useRouter } from "next/router";
import { useQuery } from "react-query";
import type { UseQueryResult } from "react-query";
import Image from "next/image";
import Link from "next/link";
import { gql } from "graphql-request";
interface Item {
  data: {
    item: {
      id: string;
      name: string;
      shortName: string;
      description: string;
      fleaMaketFee: number;
      image512pxLink: string;
      wikiLink: string;
    };
  };
}

const GET_ITEMS = gql`
  query getItem($itemId: ID!) {
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
        query: GET_ITEMS,
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
    () => fetchItem(item)
  );

  const finalItem = data?.data.item;
  console.log(finalItem);

  return (
    <>
      <h1>Items</h1>
      <div className="flex gap-4">
        {finalItem && (
          <Image
            src={finalItem.image512pxLink}
            width={100}
            height={100}
            alt={finalItem.name}
          />
        )}
        <div>
          <p>
            <strong>Name: </strong>
            {finalItem?.name}
          </p>
          <p>
            <strong>Description: </strong>
            {finalItem?.description}
          </p>
          <p>
            <strong>Fleamarket fee: </strong>
            {finalItem?.fleaMaketFee}
          </p>
          {/* <Link href={finalItem?.wikiLink}>
            <strong>More info: </strong>
            {finalItem?.wikiLink}
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default Items;
