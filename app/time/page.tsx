// app/time/page.tsx
import Layout from "@/app/layout";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Time } from "@/components/Time";

export const TimePage = () => {
  return (
    <Layout>
      <Header />
      <Time />
      <Footer />
    </Layout>
  );
};

export default TimePage;
