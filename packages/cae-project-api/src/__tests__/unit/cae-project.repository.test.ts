import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCAEProjectRepository } from '@/infrastructure/repositories/cae-project.repository.impl'
import { createInMemoryDb } from '@/infrastructure/persistence/in-memory/in-memory.db'
import type { IInMemoryDb } from '@/infrastructure/persistence/in-memory/in-memory.db.interface'
import type { CAEProject } from '@/domain/entities/cae-project.types'
import { CreateProjectCommand } from '@/application/dto/project.commands'

describe('InMemoryCAEProjectRepository', () => {
  let database: IInMemoryDb
  let repository: InMemoryCAEProjectRepository

  beforeEach(() => {
    database = createInMemoryDb()
    repository = new InMemoryCAEProjectRepository(database)
  })

  describe('getAllProjects', () => {
    it('should return empty array when no projects exist', () => {
      const projects = repository.getAllProjects()
      expect(projects).toEqual([])
    })

    it('should return all projects', () => {
      // Add projects directly to database
      const project1: CAEProject = {
        id: 1,
        name: 'Test Project 1',
        description: 'Test Description 1',
        type: 'structural',
        status: 'created',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      database.projects.push(project1)

      const projects = repository.getAllProjects()
      expect(projects).toEqual([project1])
    })

    it('should return a copy of the projects array', () => {
      const projects1 = repository.getAllProjects()
      const projects2 = repository.getAllProjects()

      expect(projects1).not.toBe(projects2) // Different references
      expect(projects1).toEqual(projects2) // Same content
    })
  })

  describe('addProject', () => {
    it('should add a new project with correct properties', () => {
      const command: CreateProjectCommand = {
        name: 'Fluid Analysis',
        description: 'CFD simulation',
        type: 'fluid' as const,
      }

      const project = repository.addProject(command)

      expect(project).toMatchObject({
        id: 1,
        name: command.name,
        description: command.description,
        type: command.type,
        status: 'created',
      })
      expect(project.createdAt).toBeInstanceOf(Date)
      expect(project.updatedAt).toBeInstanceOf(Date)
      expect(project.createdAt).toEqual(project.updatedAt)
    })

    it('should increment ID for each new project', () => {
      const command1: CreateProjectCommand = {
        name: 'Project 1',
        description: 'Description 1',
        type: 'structural' as const,
      }
      const project1 = repository.addProject(command1)
      const command2: CreateProjectCommand = {
        name: 'Project 2',
        description: 'Description 2',
        type: 'fluid' as const,
      }
      const project2 = repository.addProject(command2)

      expect(project1.id).toBe(1)
      expect(project2.id).toBe(2)
    })

    it('should store the project in the database', () => {
      const command: CreateProjectCommand = {
        name: 'Test Project',
        description: 'Test Description',
        type: 'thermal' as const,
      }
      const project = repository.addProject(command)

      expect(database.projects).toHaveLength(1)
      expect(database.projects[0]).toEqual(project)
    })

    it('should return a copy of the created project', () => {
      const command: CreateProjectCommand = {
        name: 'Test Project',
        description: 'Test Description',
        type: 'coupled' as const,
      }
      const project = repository.addProject(command)
      const storedProject = database.projects[0]

      expect(project).not.toBe(storedProject) // Different references
      expect(project).toEqual(storedProject) // Same content
    })
  })
})
