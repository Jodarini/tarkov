import { useQuery } from "react-query";
import type { UseQueryResult } from "react-query";
import Image from "next/image";

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
  const fetchTraders = async () => {
    const response = await fetch("https://api.tarkov.dev/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h2>Traders</h2>
        <table className="border-collapse border border-slate-600">
          <tbody>
            {data?.data.traders.map((trader) => (
              <tr
                className="border-collapse border border-slate-600"
                key={trader.name}
              >
                <td>
                  <Image
                    width={100}
                    height={100}
                    alt={trader.name}
                    src={trader.imageLink}
                  />
                </td>
                <td>{trader.name}</td>
                <td>{trader.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
