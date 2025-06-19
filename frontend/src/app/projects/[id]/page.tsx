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
  let userId: string | null = null;
  let role: string = "UNAUTHENTICATED";
  if (decodedToken) {
    userId = decodedToken.userId;
    role = decodedToken.role;
  } // TODO: Handle this case

  return (
    <ProjectDetailPage
      projectDetails={projectDetails}
      userId={userId}
      role={role}
    />
  );
}
