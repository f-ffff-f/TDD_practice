import { CAEProject } from '@/3_domain/entities/cae-project.interface'

/**
 * Type definition for the data required to create a new CAEProject.
 * Excludes auto-generated fields like id, status, createdAt, and updatedAt.
 */
export type CreateCAEProjectData = Pick<
  CAEProject,
  'name' | 'description' | 'type'
> &
  Partial<Pick<CAEProject, 'meshCount' | 'solverConfig'>> // Optional fields

/**
 * Creates a new CAEProject object with default values for status, createdAt, and updatedAt.
 * The ID is expected to be assigned by the repository upon saving.
 *
 * @param data - The data needed to create the project (name, description, type).
 * @returns A new CAEProject object, ready to be saved by a repository.
 */
export const createCAEProject = (
  data: CreateCAEProjectData
): Omit<CAEProject, 'id'> => {
  const now = new Date()
  return {
    name: data.name, // Trim the name as per original requirement
    description: data.description,
    type: data.type,
    status: 'created', // Default status
    meshCount: data.meshCount, // Optional
    solverConfig: data.solverConfig, // Optional
    createdAt: now, // Default creation timestamp
    updatedAt: now, // Default update timestamp (same as creation for new entities)
  }
}
