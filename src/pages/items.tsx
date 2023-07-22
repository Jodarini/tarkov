import { useRouter } from "next/router";

export const Items = () => {
  const router = useRouter();
  const item = router.query.slug;
  console.log(item);

  return (
    <>
      <h1>Items</h1>
      <p>item: {router.query.slug}</p>
    </>
  );
};
