// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const ComponentType = {
    TS_FC: 1,
    TS_FC_INTERFACE: 2,
}

function generateName(dirName) {
    if (!dirName) {
        throw new Error('dir name should not be null');
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const nameUnderlineArr = dirName.split('_');

    let stepOneClassName = '';
    
    for (const name of nameUnderlineArr) {
        stepOneClassName += capitalizeFirstLetter(name);
    }

    let stepTwoClassName = ''
    const nameCrossArr = stepOneClassName.split('-');
    
    for (const name of nameCrossArr) {
        stepTwoClassName += capitalizeFirstLetter(name);
    }

    return stepTwoClassName;
}

function generateComponent(componentName, fullPath, componentType) {
    if (fs.existsSync(fullPath)) {
        console.log(`${componentName} already exists, please choose another name.`);
        return;
    }

    fs.mkdirSync(fullPath);

    const tsFcTemplate = path.resolve(__dirname, './file_template/ts_fc.txt');
    const tsFcInterfaceTemplate = path.resolve(__dirname, './file_template/ts_fc_interface.txt');
    const sassTemplate = path.resolve(__dirname, './file_template/stylesheet.scss');

    const componentFile = path.resolve(`${fullPath}/${componentName}.tsx`);
    const styleFile = path.resolve(`${fullPath}/${componentName}.module.scss`);

    fs.writeFileSync(styleFile, fs.readFileSync(sassTemplate, { encoding: 'utf-8' }));

    let componentFileContent;

    if (componentType === ComponentType.TS_FC) {
        componentFileContent = fs.readFileSync(tsFcTemplate, { encoding: 'utf-8' });
    } else if (componentType === ComponentType.TS_FC_INTERFACE) {
        componentFileContent = fs.readFileSync(tsFcInterfaceTemplate, { encoding: 'utf-8' });
    }

    fs.writeFileSync(componentFile, componentFileContent.replace(/ClassName/g, componentName));

    vscode.window.showInformationMessage('component created successfully!');
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "react-template" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const tsFc = vscode.commands.registerCommand('extension.createTsFc', function (param) {
        // The code you place here will be executed every time your command is executed

        // vscode.window.showInformationMessage(param.fsPath); 

        const folderPath = param.fsPath;
        console.log(folderPath);

        const options = {
            prompt: "Please input the component name: ",
            placeHolder: "Component Name"
        }
        
        vscode.window.showInputBox(options).then(value => {
            if (!value) return;

            const componentName = generateName(value);
            console.log(componentName);
            const fullPath = `${folderPath}/${componentName}`;

            generateComponent(componentName, fullPath, ComponentType.TS_FC);
        });
    });

    const tsFcInterface = vscode.commands.registerCommand('extension.createTsFcWithInterface', function (param) {
        // The code you place here will be executed every time your command is executed

        // vscode.window.showInformationMessage(param.fsPath); 

        const folderPath = param.fsPath;
        console.log(folderPath);

        const options = {
            prompt: "Please input the component name: ",
            placeHolder: "Component Name"
        }
        
        vscode.window.showInputBox(options).then(value => {
            if (!value) return;

            const componentName = generateName(value);
            console.log(componentName);
            const fullPath = `${folderPath}/${componentName}`;

            generateComponent(componentName, fullPath, ComponentType.TS_FC_INTERFACE);
        });
    });


    context.subscriptions.push(tsFc);
    context.subscriptions.push(tsFcInterface);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;