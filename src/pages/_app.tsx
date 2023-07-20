import { type AppType } from "next/dist/shared/lib/utils";
import { QueryClientProvider, QueryClient } from "react-query";
import "~/styles/globals.css";
import Layout from "~/components/layout";

const queryClient = new QueryClient();
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
};

export default MyApp;
