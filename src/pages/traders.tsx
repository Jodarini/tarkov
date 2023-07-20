import { useQuery } from "react-query";

export default function Traders() {
  //   let fetchTraders = () => {
  //     fetch("https://api.tarkov.dev/graphql", {
  //         method:
  //     })
  //   }

  //   const { isLoading, isError, data, error } = useQuery({
  //     queryKey: ["traders"],
  //     queryFn: fetchTraders,
  //   });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h2>Traders</h2>
      </main>
    </>
  );
}
