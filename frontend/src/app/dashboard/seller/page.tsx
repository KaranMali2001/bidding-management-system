import { bidsApi } from "@/lib/api/bids";

export default async function Page() {
  const sellerProjects = await bidsApi.getSellerBids();
  console.log("sellerProjects", sellerProjects);
  return (
    <div>
      <h1>Seller Dashboard</h1>
    </div>
  );
}
