import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

export interface PageTemplate {
  id: string;
  name: string;
  description?: string;
  data: any;
  tags?: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  isPublic?: boolean;
  author?: string;
}

export interface StorageConfig {
  type: "local" | "azurite" | "cosmos";
  connectionString?: string;
  containerName?: string;
  databaseName?: string;
}

class PageStorageService {
  private config: StorageConfig;
  private blobServiceClient?: BlobServiceClient;
  private containerClient?: ContainerClient;

  constructor(config: StorageConfig = { type: "local" }) {
    this.config = config;
    this.initializeStorage();
  }

  private async initializeStorage() {
    if (this.config.type === "azurite") {
      const connectionString =
        this.config.connectionString ||
        "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=devstoreaccount1;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;";

      this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerName = this.config.containerName || "page-templates";
      this.containerClient = this.blobServiceClient.getContainerClient(containerName);

      // Ensure container exists
      await this.containerClient.createIfNotExists();
    }
  }

  // Save page template
  async saveTemplate(
    template: Omit<PageTemplate, "id" | "createdAt" | "updatedAt">
  ): Promise<PageTemplate> {
    const now = new Date().toISOString();
    const fullTemplate: PageTemplate = {
      ...template,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      version: "1.0.0",
    };

    try {
      if (this.config.type === "local") {
        // Save to local storage
        localStorage.setItem(`page-template-${fullTemplate.id}`, JSON.stringify(fullTemplate));

        // Also save to templates directory (simulated)
        const templates = this.getLocalTemplates();
        templates.push(fullTemplate);
        localStorage.setItem("page-templates-list", JSON.stringify(templates));
      } else if (this.config.type === "azurite" && this.containerClient) {
        // Save to Azurite blob storage
        const blobName = `templates/${fullTemplate.id}.json`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

        const blobData = JSON.stringify(fullTemplate, null, 2);
        await blockBlobClient.upload(blobData, blobData.length, {
          blobHTTPHeaders: {
            blobContentType: "application/json",
          },
          metadata: {
            name: fullTemplate.name,
            category: fullTemplate.category || "general",
            tags: fullTemplate.tags?.join(",") || "",
            version: fullTemplate.version,
          },
        });
      }

      return fullTemplate;
    } catch (error) {
      console.error("Failed to save template:", error);
      throw new Error(`Failed to save template: ${error}`);
    }
  }

  // Get template by ID
  async getTemplate(id: string): Promise<PageTemplate | null> {
    try {
      if (this.config.type === "local") {
        const templateData = localStorage.getItem(`page-template-${id}`);
        return templateData ? JSON.parse(templateData) : null;
      } else if (this.config.type === "azurite" && this.containerClient) {
        const blobName = `templates/${id}.json`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

        try {
          const response = await blockBlobClient.download();
          const templateData = await this.streamToString(response.readableStreamBody!);
          return JSON.parse(templateData);
        } catch (error) {
          if ((error as any).statusCode === 404) {
            return null;
          }
          throw error;
        }
      }

      return null;
    } catch (error) {
      console.error("Failed to get template:", error);
      return null;
    }
  }

  // Get all templates
  async getAllTemplates(): Promise<PageTemplate[]> {
    try {
      if (this.config.type === "local") {
        return this.getLocalTemplates();
      } else if (this.config.type === "azurite" && this.containerClient) {
        const templates: PageTemplate[] = [];

        for await (const blob of this.containerClient.listBlobsFlat({ prefix: "templates/" })) {
          if (blob.name.endsWith(".json")) {
            const template = await this.getTemplate(
              blob.name.replace("templates/", "").replace(".json", "")
            );
            if (template) {
              templates.push(template);
            }
          }
        }

        return templates.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }

      return [];
    } catch (error) {
      console.error("Failed to get templates:", error);
      return [];
    }
  }

  // Update template
  async updateTemplate(id: string, updates: Partial<PageTemplate>): Promise<PageTemplate | null> {
    try {
      const existingTemplate = await this.getTemplate(id);
      if (!existingTemplate) {
        return null;
      }

      const updatedTemplate: PageTemplate = {
        ...existingTemplate,
        ...updates,
        updatedAt: new Date().toISOString(),
        version: this.incrementVersion(existingTemplate.version),
      };

      if (this.config.type === "local") {
        localStorage.setItem(`page-template-${id}`, JSON.stringify(updatedTemplate));

        // Update in templates list
        const templates = this.getLocalTemplates();
        const index = templates.findIndex(t => t.id === id);
        if (index !== -1) {
          templates[index] = updatedTemplate;
          localStorage.setItem("page-templates-list", JSON.stringify(templates));
        }
      } else if (this.config.type === "azurite" && this.containerClient) {
        // Delete old blob and create new one
        const blobName = `templates/${id}.json`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();

        const blobData = JSON.stringify(updatedTemplate, null, 2);
        await blockBlobClient.upload(blobData, blobData.length, {
          blobHTTPHeaders: {
            blobContentType: "application/json",
          },
          metadata: {
            name: updatedTemplate.name,
            category: updatedTemplate.category || "general",
            tags: updatedTemplate.tags?.join(",") || "",
            version: updatedTemplate.version,
          },
        });
      }

      return updatedTemplate;
    } catch (error) {
      console.error("Failed to update template:", error);
      return null;
    }
  }

  // Delete template
  async deleteTemplate(id: string): Promise<boolean> {
    try {
      if (this.config.type === "local") {
        localStorage.removeItem(`page-template-${id}`);

        // Remove from templates list
        const templates = this.getLocalTemplates();
        const filteredTemplates = templates.filter(t => t.id !== id);
        localStorage.setItem("page-templates-list", JSON.stringify(filteredTemplates));
      } else if (this.config.type === "azurite" && this.containerClient) {
        const blobName = `templates/${id}.json`;
        const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();
      }

      return true;
    } catch (error) {
      console.error("Failed to delete template:", error);
      return false;
    }
  }

  // Search templates
  async searchTemplates(
    query: string,
    filters?: { category?: string; tags?: string[] }
  ): Promise<PageTemplate[]> {
    try {
      const allTemplates = await this.getAllTemplates();

      return allTemplates.filter(template => {
        const matchesQuery =
          query === "" ||
          template.name.toLowerCase().includes(query.toLowerCase()) ||
          template.description?.toLowerCase().includes(query.toLowerCase()) ||
          template.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

        const matchesCategory = !filters?.category || template.category === filters.category;
        const matchesTags =
          !filters?.tags || filters.tags.every(tag => template.tags?.includes(tag));

        return matchesQuery && matchesCategory && matchesTags;
      });
    } catch (error) {
      console.error("Failed to search templates:", error);
      return [];
    }
  }

  // Export template to file
  exportTemplate(template: PageTemplate): void {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Import template from file
  async importTemplate(file: File): Promise<PageTemplate | null> {
    try {
      const text = await file.text();
      const template = JSON.parse(text);

      // Validate template structure
      if (!template.name || !template.data) {
        throw new Error("Invalid template format");
      }

      // Save imported template
      return await this.saveTemplate({
        name: template.name,
        description: template.description,
        data: template.data,
        tags: template.tags,
        category: template.category,
        isPublic: template.isPublic,
        author: template.author,
      });
    } catch (error) {
      console.error("Failed to import template:", error);
      return null;
    }
  }

  // Private helper methods
  private getLocalTemplates(): PageTemplate[] {
    try {
      const templatesData = localStorage.getItem("page-templates-list");
      return templatesData ? JSON.parse(templatesData) : [];
    } catch {
      return [];
    }
  }

  private generateId(): string {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private incrementVersion(version: string): string {
    const [major, minor, patch] = version.split(".").map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  private async streamToString(readableStream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      readableStream.on("data", (data: any) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }
}

// Create default instance
export const pageStorage = new PageStorageService();

// Export for use in components
export default PageStorageService;
