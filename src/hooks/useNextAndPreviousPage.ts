import { useState } from "react";
import type { NextRouter } from "next/router";

const useNextAndPreviousPage = (router: NextRouter, page: number) => {
  const [currentPage, setCurrentPage] = useState(page);

  const handleNextPage = () => {
    setCurrentPage((previousPage: number) => {
      const page = previousPage + 1;
      router
        .push({
          pathname: "",
          query: { page },
        })
        .catch((error) => {
          console.log(error);
        });
      return page;
    });
  };

  const handlePreviousPage = () => {
    setCurrentPage((previousPage: number) => {
      const page = previousPage - 1;
      router
        .push({
          pathname: "",
          query: { page },
        })
        .catch((error) => {
          console.log(error);
        });
      return page;
    });
  };

  return { currentPage, handleNextPage, handlePreviousPage };
};

export default useNextAndPreviousPage;
