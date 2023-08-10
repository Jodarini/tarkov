import type { NextRouter } from "next/router";

const useNextAndPreviousPage = (router: NextRouter, page: number) => {
  const handleNextPage = () => {
    page++;
    const search = router.query.search;
    router
      .push({
        query: { search, page },
      })
      .catch((error: string) => {
        throw new Error(error);
      });

    return page;
  };

  const handlePreviousPage = () => {
    page--;
    const search = router.query.search;
    router
      .push({
        query: { search, page },
      })
      .catch((error: string) => {
        throw new Error(error);
      });
    return page;
  };

  return { handleNextPage, handlePreviousPage };
};

export default useNextAndPreviousPage;
