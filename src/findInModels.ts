import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';


function getModelsFromWorkspace(): string[] {
    const modelFiles: string[] = [];
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders) {
        workspaceFolders.forEach(folder => {
            const modelsPath = path.join(folder.uri.fsPath, 'app', 'Models');
            getFilesInDirectory(modelsPath, modelFiles);
        });
    }

    return modelFiles;
}

function getFilesInDirectory(dir: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFilesInDirectory(filePath, fileList);
        } else {
            fileList.push(filePath); // Agregar todos los archivos sin filtrar por nombre
        }
    });

    return fileList;
}

async function searchModels(context: vscode.ExtensionContext) {

    const models = getModelsFromWorkspace();

    if (models.length === 0) {
        vscode.window.showErrorMessage('No se encontraron archivos de modelos en /app/Models en ninguna carpeta del workspace.');
        return;
    }

    // Mostrar el QuickPick con íconos de archivo para cada controlador
    const selectedModel = await vscode.window.showQuickPick(
        
        models.map( model => {
            
            const relativePath = vscode.workspace.asRelativePath(model); // Ruta relativa
            
            return {
                label: path.basename(model),
                description: relativePath,
                filePath: model,
                // iconPath: new vscode.ThemeIcon('file-code')
                iconPath: vscode.Uri.file( path.join(context.extensionPath, 'media', 'php-icon.svg' ))
            };
        }),
        { placeHolder: 'Busca y selecciona un modelo', matchOnDescription: true }
    );

    // Abrir el archivo seleccionado en el editor
    if (selectedModel) {
        const document = await vscode.workspace.openTextDocument(selectedModel.filePath);
        vscode.window.showTextDocument(document);
    }
}

function helloWorld(){
    vscode.window.showInformationMessage('Hello World from laravel-search!');
}

export {
    helloWorld,
    searchModels
};

