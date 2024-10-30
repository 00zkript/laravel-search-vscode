import * as vscode from 'vscode';
import * as findInControllers from './findInControllers';
import * as findInModels from './findInModels';

export function activate(context: vscode.ExtensionContext) {

	// console.log('Congratulations, your extension "laravel-search" is now active!');

	const helloWorld = vscode.commands.registerCommand('laravel-search.helloWorld', findInControllers.helloWorld);
	context.subscriptions.push(helloWorld);
	
	const searchControllers = vscode.commands.registerCommand('laravel-search.searchControllers', _ => findInControllers.searchControllers(context));
	context.subscriptions.push(searchControllers);

	const searchModels = vscode.commands.registerCommand('laravel-search.searchModels', _ => findInModels.searchModels(context));
	context.subscriptions.push(searchModels);

}

export function deactivate() {}
