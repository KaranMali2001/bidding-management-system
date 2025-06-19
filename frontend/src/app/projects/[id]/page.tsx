import ProjectDetailPage from "@/components/projectComponents/projectDetailsPage";
import { projectsApi } from "@/lib/api/projects";
import { JwtPayload } from "@/lib/types";
import { getTokenServer } from "@/utils/getTokenServer";
import jwt from "jsonwebtoken";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectDetails = await projectsApi.getProjectById(id);
  const token = await getTokenServer();
  // Cast to JwtPayload after decoding
  const decodedToken = jwt.decode(token) as JwtPayload | null;

  if (!decodedToken) return <div>No decoded token found</div>;

  const userId = decodedToken.userId;
  const role = decodedToken.role;
  console.log("userId", userId);
  console.log("role", role);
  return (
    <ProjectDetailPage project={projectDetails} userId={userId} role={role} />
  );
}
