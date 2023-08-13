import { useQuery } from "react-query";
import type { UseQueryResult } from "react-query";
import Image from "next/image";
import { fetchTraders } from "~/services/fetch-api";

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
  const { isLoading, error, data }: UseQueryResult<Traders> = useQuery({
    queryKey: ["traders"],
    queryFn: fetchTraders,
  });

  const traders = data?.data.traders;

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
      {traders &&
        traders.map((trader) => (
          <div
            className="flex flex-col gap-4 border-b-[1px] border-b-slate-400 p-2 md:flex-row "
            key={trader.name}
          >
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
        ))}
    </>
  );
}
