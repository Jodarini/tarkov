import { useState } from "react";
import type { NextRouter } from "next/router";

const useNextAndPreviousPage = (router: NextRouter, page: number) => {
  const [currentPage, setCurrentPage] = useState(page);

  const handleNextPage = () => {
    setCurrentPage((previousPage: number) => {
      const page = previousPage + 1;
      const search = router.query.search;
      void router.push({
        query: { search, page },
      });

      return page;
    });
  };

  const handlePreviousPage = () => {
    setCurrentPage((previousPage: number) => {
      const page = previousPage - 1;
      const search = router.query.search;
      void router.push({
        query: { search, page },
      });
      return page;
    });
  };

  return { currentPage, handleNextPage, handlePreviousPage };
};

export default useNextAndPreviousPage;
