
import { log } from 'console'
import * as ts from 'typescript';
import * as fs from 'fs';

export class GlideRecordDBInit{

    private tableName:string = "";
    private modulePath:string = ""; 
    private tableInterfaceNode:ts.InterfaceDeclaration | undefined;
    public tableProperties: Map<string, ts.TypeElement> = new Map();

    constructor(tableName:string, modulePath:string = "") {
        this.tableName = tableName;
        this.modulePath = modulePath;
    }

    public getTableInterfaceFromModule(){
        const program = ts.createProgram([this.modulePath], { allowJs: true });
        const sourceFile = program.getSourceFile(this.modulePath);
        const typeChecker = program.getTypeChecker();


         // const sourceFile = this.getSourceFile(this.modulePath);
        this.traverse(sourceFile);
        if (this.tableInterfaceNode) {
            const properties = this.getAllInterfaceProperties(this.tableInterfaceNode, typeChecker);
            //console.log(`Interface ${this.tableInterfaceNode.name.text} properties:`);
            // properties.forEach((property, name) => {
            //     //console.log(`  - ${name}: ${typeChecker.typeToString(typeChecker.getTypeAtLocation(property))}`);
            //     console.log(`  - ${name}`);
            // });
            this.tableProperties = properties;
            // const properties = this.getInterfaceProperties(this.tableInterfaceNode);
            // console.log('Properties of interface', this.tableName, ':', properties);
        } else {
            console.log('Interface not found');
        }
    }


    public static async initializeGlideRecordDBTypes(modulePath:any, interfaceName:any) : Promise<any>{
       
        let dbInit = new GlideRecordDBInit(interfaceName, modulePath);
        dbInit.getTableInterfaceFromModule();
      
    }

    

    private getInterfaceProperties(node: ts.Node): string[] {
        
        let properties: string[] = [];

        function visit(node: ts.Node) {
           if(ts.isInterfaceDeclaration(node)){
            let interfaceNode = node as ts.InterfaceDeclaration;
            interfaceNode.members.forEach(member => {
                if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
                    properties.push(member.name.text);
                }
            });
           }
           
           
        }
        visit(node);
        return properties;
    }

    public traverse(node: ts.Node) {
      switch (node.kind) {
        case ts.SyntaxKind.InterfaceDeclaration:
          const interfaceNode = node as ts.InterfaceDeclaration;
          //console.log('Interface:', interfaceNode.name.text);
          if(interfaceNode.name.text === this.tableName){
            this.tableInterfaceNode = interfaceNode;
            console.log('Found table name:', interfaceNode.name.text);
          }
          // Process interface members
          break;
        // case ts.SyntaxKind.ClassDeclaration:
        //   const classNode = node as ts.ClassDeclaration;
        //   console.log('Class:', classNode.name.text);
        //   // Process class members
        //   break;
        // Handle other node types as needed
      }
      ts.forEachChild(node, (childNode) => {
           // this refers to an instance of MyClass
           this.traverse(childNode);
        });
    }


    public static async importInterface(modulePath: string, exportName: string): Promise<any> {
        const module = await import(modulePath);
        return module[exportName];
    }

    public getSourceFile(modulePath:string): any{
        const sourceFile = ts.createSourceFile(modulePath, 
            fs.readFileSync(modulePath, 'utf-8'), 
            ts.ScriptTarget.Latest, true);
        return sourceFile;  
    }

    private processFile(filePath: string) {
        const program = ts.createProgram([filePath], { allowJs: true });
        const sourceFile = program.getSourceFile(filePath);
        const typeChecker = program.getTypeChecker();

        if (sourceFile) {
            ts.forEachChild(sourceFile, (node) => {
                if (ts.isInterfaceDeclaration(node)) {
                    const properties = this.getAllInterfaceProperties(node, typeChecker);
                    console.log(`Interface ${node.name.text} properties:`);
                    properties.forEach((property, name) => {
                    console.log(`  - ${name}: ${typeChecker.typeToString(typeChecker.getTypeAtLocation(property))}`);
                    });
                }
            });
        }
    }

    getAllInterfaceProperties(
        node: ts.InterfaceDeclaration,
        typeChecker: ts.TypeChecker,
        properties: Map<string, ts.TypeElement> = new Map()
        ): Map<string, ts.TypeElement> {
        // Add properties of current interface
        node.members.forEach((member) => {
            if (ts.isPropertySignature(member) && member.name) {
                properties.set(member.name.getText(), member);
            }
        });

        // Get base types (heritage clauses)
        const heritageClauses = node.heritageClauses;
        if (heritageClauses) {
            heritageClauses.forEach((clause) => {
            if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                clause.types.forEach((type) => {
                const symbol = typeChecker.getSymbolAtLocation(type.expression);
                if (symbol && symbol.declarations) {
                    symbol.declarations.forEach((declaration) => {
                    if (ts.isInterfaceDeclaration(declaration)) {
                        // Recursively get properties from base interface
                        this.getAllInterfaceProperties(declaration, typeChecker, properties);
                    }
                    });
                }
                });
            }
            });
        }

        return properties;
    }



}