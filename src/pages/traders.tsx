import { useQuery } from "react-query";
import type { UseQueryResult } from "react-query";
import Image from "next/image";
import { useRouter } from "next/router";

interface Traders {
  data: {
    traders: {
      name: string;
      imageLink: string;
      description: string;
    }[];
  };
}

export default function Traders() {
  const router = useRouter();
  const fetchTraders = async () => {
    const response = await fetch("https://api.tarkov.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
            query allTraders {
             traders{
               name
               imageLink
               description
               }
             }
        `,
      }),
    });
    return response.json();
  };

  const { isLoading, error, data }: UseQueryResult<Traders> = useQuery({
    queryKey: ["traders"],
    queryFn: fetchTraders,
  });

  if (error) return "An error ocurred";

  return (
    <>
      <h3 className="mb-4 text-2xl font-bold">Traders</h3>
      {isLoading && (
        <>
          <div className="flex gap-10 border-b-[1px] border-b-slate-400">
            <div className="flex flex-col gap-4 p-2 md:flex-row">
              <div className="flex min-w-[100px] flex-col">Loading...</div>
            </div>
          </div>
        </>
      )}
      {data?.data.traders.map((trader) => (
        <div
          className="flex gap-10 border-b-[1px] border-b-slate-400"
          key={trader.name}
        >
          <div className="flex flex-col gap-4 p-2 md:flex-row">
            <div className="flex min-w-[100px] flex-col">
              <Image
                width={50}
                height={50}
                alt={trader.name}
                className="min-w-[100px] self-center"
                src={trader.imageLink}
              />
              <span className="text-center">{trader.name}</span>
            </div>
            <p>{trader.description}</p>
          </div>
        </div>
      ))}
    </>
  );
}
