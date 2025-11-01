import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorContext } from '../types/error';

interface VibeAssistContextFile extends ErrorContext {
    generatedAt: string;
    workspaceFolder: string;
}

export class ContextGenerator {
    private readonly CONTEXT_FILE_NAME = '.vibeassist-context.json';
    private readonly MAX_FILE_SIZE = 500 * 80; // ~500 lines worth of characters

    async generateContextFile(): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder open');
        }

        const context = await this.collectProjectContext(workspaceFolder.uri.fsPath);
        const contextFilePath = path.join(workspaceFolder.uri.fsPath, this.CONTEXT_FILE_NAME);

        const contextFile: VibeAssistContextFile = {
            generatedAt: new Date().toISOString(),
            workspaceFolder: workspaceFolder.name,
            ...context
        };

        // Write context file
        await fs.promises.writeFile(
            contextFilePath,
            JSON.stringify(contextFile, null, 2),
            'utf8'
        );

        console.log('VibeAssist: Context file generated at', contextFilePath);
    }

    async loadContextFile(): Promise<ErrorContext | null> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return null;
        }

        const contextFilePath = path.join(workspaceFolder.uri.fsPath, this.CONTEXT_FILE_NAME);
        
        try {
            const content = await fs.promises.readFile(contextFilePath, 'utf8');
            const parsed = JSON.parse(content) as VibeAssistContextFile;
            
            // Return only the ErrorContext fields
            return {
                projectType: parsed.projectType,
                dependencies: parsed.dependencies,
                framework: parsed.framework,
                configurations: parsed.configurations,
                customContext: parsed.customContext
            };
        } catch (error) {
            console.log('VibeAssist: No context file found or failed to load');
            return null;
        }
    }

    private async collectProjectContext(workspacePath: string): Promise<ErrorContext> {
        const context: ErrorContext = {
            dependencies: {},
            configurations: {}
        };

        // Detect project type and collect dependencies
        await this.detectPythonProject(workspacePath, context);
        await this.detectNodeProject(workspacePath, context);
        await this.detectFrameworks(workspacePath, context);
        await this.collectConfigurations(workspacePath, context);

        return context;
    }

    private async detectPythonProject(workspacePath: string, context: ErrorContext): Promise<void> {
        // Check for requirements.txt
        const requirementsTxt = path.join(workspacePath, 'requirements.txt');
        if (fs.existsSync(requirementsTxt)) {
            context.projectType = 'python';
            const content = await fs.promises.readFile(requirementsTxt, 'utf8');
            const deps = this.parsePythonRequirements(content);
            context.dependencies = { ...context.dependencies, ...deps };
        }

        // Check for pyproject.toml
        const pyprojectToml = path.join(workspacePath, 'pyproject.toml');
        if (fs.existsSync(pyprojectToml)) {
            context.projectType = 'python';
            // Basic parsing - just note it exists
            context.configurations!['pyproject.toml'] = 'exists';
        }

        // Check for setup.py
        const setupPy = path.join(workspacePath, 'setup.py');
        if (fs.existsSync(setupPy)) {
            context.projectType = 'python';
        }
    }

    private async detectNodeProject(workspacePath: string, context: ErrorContext): Promise<void> {
        const packageJson = path.join(workspacePath, 'package.json');
        if (fs.existsSync(packageJson)) {
            if (!context.projectType) {
                context.projectType = 'node';
            }
            
            try {
                const content = await fs.promises.readFile(packageJson, 'utf8');
                const pkg = JSON.parse(content);
                
                // Collect dependencies (limit to important ones)
                const allDeps = {
                    ...pkg.dependencies,
                    ...pkg.devDependencies
                };
                
                // Only keep top 20 dependencies to avoid bloat
                const topDeps = Object.entries(allDeps)
                    .slice(0, 20)
                    .map(([key, value]) => [key, String(value)]);
                context.dependencies = { 
                    ...context.dependencies, 
                    ...Object.fromEntries(topDeps)
                };
            } catch (error) {
                console.error('Failed to parse package.json:', error);
            }
        }
    }

    private async detectFrameworks(workspacePath: string, context: ErrorContext): Promise<void> {
        const packageJson = path.join(workspacePath, 'package.json');
        
        if (fs.existsSync(packageJson)) {
            try {
                const content = await fs.promises.readFile(packageJson, 'utf8');
                const pkg = JSON.parse(content);
                const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

                // Detect common frameworks
                if (allDeps['react']) {
                    context.framework = 'react';
                } else if (allDeps['vue']) {
                    context.framework = 'vue';
                } else if (allDeps['@angular/core']) {
                    context.framework = 'angular';
                } else if (allDeps['next']) {
                    context.framework = 'next.js';
                } else if (allDeps['express']) {
                    context.framework = 'express';
                }
            } catch (error) {
                // Ignore
            }
        }

        // Detect Python frameworks
        if (context.dependencies) {
            if (context.dependencies['django']) {
                context.framework = 'django';
            } else if (context.dependencies['flask']) {
                context.framework = 'flask';
            } else if (context.dependencies['fastapi']) {
                context.framework = 'fastapi';
            }
        }
    }

    private async collectConfigurations(workspacePath: string, context: ErrorContext): Promise<void> {
        const configFiles = [
            'tsconfig.json',
            '.eslintrc.json',
            'vite.config.js',
            'webpack.config.js',
            '.env.example',
            'docker-compose.yml',
            'Dockerfile'
        ];

        for (const configFile of configFiles) {
            const filePath = path.join(workspacePath, configFile);
            if (fs.existsSync(filePath)) {
                context.configurations![configFile] = 'present';
            }
        }
    }

    private parsePythonRequirements(content: string): Record<string, string> {
        const deps: Record<string, string> = {};
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                // Parse package==version or package>=version
                const match = trimmed.match(/^([a-zA-Z0-9_-]+)([><=!]+)?(.+)?$/);
                if (match) {
                    const [, pkg, , version] = match;
                    deps[pkg] = version ? version.trim() : 'any';
                }
            }
        }
        
        // Limit to top 20
        const entries = Object.entries(deps).slice(0, 20);
        return Object.fromEntries(entries);
    }
}


