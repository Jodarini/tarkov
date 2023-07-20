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
  console.log(router.asPath);
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

  return (
    <>
      <h3 className="mb-4 text-2xl font-bold">Traders</h3>
      <table className="border-collapse border-slate-600">
        <thead>
          <tr className="border-b border-slate-600 p-2">
            <th colSpan={2} className="p-2">
              Name
            </th>
            <th className="p-2">description</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.traders.map((trader) => (
            <tr className="border-b border-slate-600" key={trader.name}>
              <td className="p-2">
                <Image
                  width={100}
                  height={100}
                  alt={trader.name}
                  src={trader.imageLink}
                />
              </td>
              <td className="p-2">{trader.name}</td>
              <td className="p-2">{trader.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
