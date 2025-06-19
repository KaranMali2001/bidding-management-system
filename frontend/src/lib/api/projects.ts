import { apiClient } from "@/config/axios";
import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from "@/lib/types";

export const projectsApi = {
  // Get all open projects (public)
  getOpenProjects: async (): Promise<Project[]> => {
    const res = await apiClient.get<Project[]>("/projects/open");
    return res.data;
  },

  // Get buyer's projects
  getBuyerProjects: async (): Promise<Project[]> => {
    const res = await apiClient.get<Project[]>("/projects");

    return res.data;
  },

  // Get project by ID
  getProjectById: async (id: string): Promise<Project> => {
    const res = await apiClient.get<Project>(`/projects/${id}`);
    return res.data;
  },

  // Create new project
  createProject: async (data: CreateProjectPayload): Promise<Project> => {
    const res = await apiClient.post<Project>("/projects", data);
    return res.data;
  },

  // Update project status
  updateProjectStatus: async (id: string, status: string): Promise<Project> => {
    const res = await apiClient.patch<Project>(`/projects/${id}/status`, {
      status,
    });
    return res.data;
  },

  // Mark project as complete
  markProjectComplete: async (id: string): Promise<Project> => {
    const res = await apiClient.patch<Project>(`/projects/${id}/complete`);
    return res.data;
  },
  updateProject: async (
    id: string,
    data: UpdateProjectPayload
  ): Promise<Project> => {
    const res = await apiClient.put<Project>(`/projects/${id}`, data);
    return res.data;
  },
  // Select seller for project
  selectSeller: async (projectId: string, bidId: string): Promise<Project> => {
    const res = await apiClient.post<Project>(
      `/projects/${projectId}/select/${bidId}`
    );
    return res.data;
  },
};
