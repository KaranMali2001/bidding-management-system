import { BuyerDashboardContent } from "@/components/buyersComponent/dashboard";
import ErrorPage from "@/components/Error";
import { projectsApi } from "@/lib/api/projects";

export default async function Page() {
  try {
    const buyerProjects = await projectsApi.getBuyerProjects();
    return <BuyerDashboardContent BuyersProject={buyerProjects} />;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <>
        <ErrorPage />
      </>
    );
  }
}
