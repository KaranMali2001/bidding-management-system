import CompactDashboard from "@/components/sellersComponent/dashboard";
import { bidsApi } from "@/lib/api/bids";

export default async function Page() {
  const sellerProjects = await bidsApi.getSellerBids();

  return (
    <div>
      <CompactDashboard sellerProjects={sellerProjects} />
    </div>
  );
}
