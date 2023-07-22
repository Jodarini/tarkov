import { useRouter } from "next/router";

const Items = () => {
  const router = useRouter();
  const item = router.query.id;
  console.log(item);

  return (
    <>
      <h1>Items</h1>
      <p>item: {router.query.id}</p>
    </>
  );
};

export default Items;
