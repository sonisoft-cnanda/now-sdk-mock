import { InMemoryDataTable } from "./InMemoryDataTable";

export class Database{
    private static _instance:Database;
    public static getInstance():Database{
          if(!Database._instance){
               Database._instance = new Database();
          }
          return Database._instance;
     }
 
     public static reInitialize(){
         Database._instance = new Database();
     }
 
     private _mockData:Record<string,InMemoryDataTable> = {};
 
     public getMockData():Record<string,InMemoryDataTable>{
         return this._mockData;
     }
 
     private setMockData(data:Record<string,InMemoryDataTable>){
         this._mockData = data;
     }
 
     public addTable(tableName:string) : InMemoryDataTable{
         if(!this._mockData[tableName])
            this._mockData[tableName] = new InMemoryDataTable(tableName);
 
         return  this._mockData[tableName];
     }
 
     public getTable(tableName:string){
         return this._mockData[tableName];
     }
 }