import { useState } from "react";
import type { NextRouter } from "next/router";

const useNextAndPreviousPage = (router: NextRouter, page: number) => {
  const handleNextPage = () => {
    page++;
    const search = router.query.search;
    void router.push({
      query: { search, page },
    });

    return page;
  };

  const handlePreviousPage = () => {
    page--;
    const search = router.query.search;
    void router.push({
      query: { search, page },
    });
    return page;
  };

  return { handleNextPage, handlePreviousPage };
};

export default useNextAndPreviousPage;
