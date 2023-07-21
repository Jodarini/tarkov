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

  if (error) return "An error ocurred";

  return (
    <>
      <h3 className="mb-4 text-2xl font-bold">Traders</h3>
      <table className="border-collapse border-slate-600 text-left">
        <thead>
          <tr className="border-b border-slate-600 p-2">
            <th colSpan={2} className="p-2 text-center">
              Name
            </th>
            <th className="p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <>
              <tr className="border-b border-slate-600">
                <td className="p-2">loading...</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
              </tr>
              <tr className="border-b border-slate-600">
                <td className="p-2">loading...</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
              </tr>
              <tr className="border-b border-slate-600">
                <td className="p-2">loading...</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
              </tr>
              <tr className="border-b border-slate-600">
                <td className="p-2">loading...</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
              </tr>
              <tr className="border-b border-slate-600">
                <td className="p-2">loading...</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
              </tr>
              <tr className="border-b border-slate-600">
                <td className="p-2">loading...</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
              </tr>
              <tr className="border-b border-slate-600">
                <td className="p-2">loading...</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
              </tr>
              <tr className="border-b border-slate-600">
                <td className="p-2">loading...</td>
                <td className="p-2"></td>
                <td className="p-2"></td>
              </tr>
            </>
          )}
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
