import { useRouter } from "next/router";
import { UseQueryResult, useQuery } from "react-query";

interface Item {
  data: {
    item: {
      id: string;
      name: string;
      shortName: string;
      description: string;
      fleaMakerFee: number;
      gridImageLink: string;
      wikiLink: string;
    };
  };
}

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
        query: `
        query {
          item(id: "5447a9cd4bdc2dbd208b4567"){
            id
            name 
            shortName
            description
            fleaMarketFee
		        gridImageLink    
            baseImageLink
            wikiLink
          }
        } 
        `,
        variables: {
          item: item,
        },
      }),
    });

    if (!res.ok) {
      throw new Error("An error ocurred");
    }

    return res.json();
  };

  const { isLoading, error, data }: UseQueryResult<Item> = useQuery(
    ["item", item],
    () => fetchItem(item)
  );

  console.log(Object.entries(data?.data.item));

  return (
    <>
      <h1>Items</h1>
      <p>item: {router.query.id}</p>
      {data &&
        Object.entries(data.data.item).map((item) => (
          <p key={item.id}>{item.name}</p>
        ))}
    </>
  );
};

export default Items;
