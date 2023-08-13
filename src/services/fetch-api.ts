import { gql } from "graphql-request";

const GET_TRADERS = gql`
  query allTraders {
    traders {
      name
      imageLink
      description
    }
  }
`;

export const fetchTraders = async () => {
  const response = await fetch("https://api.tarkov.dev/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_TRADERS,
    }),
  });
  return response.json();
};

const GET_ITEMS = gql`
  query ($limit: Int, $offset: Int, $name: [String]) {
    items(limit: $limit, offset: $offset, names: $name) {
      id
      name
      shortName
      description
      baseImageLink
      sellFor {
        source
        priceRUB
        price
      }
    }
  }
`;

export const fetchItems = async (
  page: number,
  searchQuery: string | undefined,
  limit: number
) => {
  if (searchQuery === null || searchQuery === "") searchQuery = undefined;
  const offset = (page - 1) * limit;
  const response = await fetch("https://api.tarkov.dev/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_ITEMS,
      variables: {
        limit: limit,
        offset: offset,
        name: searchQuery,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("An error occurred");
  }
  return response.json();
};
