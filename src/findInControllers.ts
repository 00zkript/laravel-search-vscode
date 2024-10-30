import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';


function getControllersFromWorkspace(): string[] {
    const controllerFiles: string[] = [];
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders) {
        workspaceFolders.forEach(folder => {
            const controllersPath = path.join(folder.uri.fsPath, 'app', 'Http', 'Controllers');
            getFilesInDirectory(controllersPath, controllerFiles);
        });
    }

    return controllerFiles;
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
            fileList.push(filePath); 
        }
    });

    return fileList;
}

function getControllerFiles(dir: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getControllerFiles(filePath, fileList);
        } else if (file.endsWith('Controller.php')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

async function searchControllers(context: vscode.ExtensionContext) {

    const controllers = getControllersFromWorkspace();

    if (controllers.length === 0) {
        vscode.window.showErrorMessage('No se encontraron archivos de controladores en /app/Http/Controllers en ninguna carpeta del workspace.');
        return;
    }

    
    const selectedController = await vscode.window.showQuickPick(
        
        controllers.map(controller => {
            
            const relativePath = vscode.workspace.asRelativePath(controller); 
            
            return {
                label: path.basename(controller),
                description: relativePath,
                filePath: controller,
                // iconPath: new vscode.ThemeIcon('file-code')
                iconPath: vscode.Uri.file( path.join(context.extensionPath, 'media', 'php-icon.svg' ))
            };
        }),
        { placeHolder: 'Busca y selecciona un controlador', matchOnDescription: true }
    );

    
    if (selectedController) {
        const document = await vscode.workspace.openTextDocument(selectedController.filePath);
        vscode.window.showTextDocument(document);
    }
}

function helloWorld(){
    vscode.window.showInformationMessage('Hello World from laravel-search!');
}

export {
    helloWorld,
    searchControllers
};

