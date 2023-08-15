
const fs=require("fs")
const xlsx=require("xlsx")
const Plotly = require('plotly.js-dist-min');
const { trace } = require("console");


class DataFrame{
    constructor(data){
        this.data=data;
    }
    static fromArray(data){
        return new DataFrame(data);
    }
    // read excel data file xlxs
    static readExcel(filePath,SheetName){
        const workbook=xlsx.readFile(filePath);
        const sheet=workbook.Sheets[SheetName || workbook.SheetNames[0]];
        const data=xlsx.utils.sheet_to_json(sheet);

        return new DataFrame(data);
    }

    static readCSV(filePath){
        const csvContent=fs.readFileSync(filePath,'utf-8');
        const lines=csvContent.trim().split('\n');
        const headers=lines.shift().split(',');

        const data=lines.map((line)=>{
            const values=line.split(',');
            const row={};
            headers.forEach((header,index)=>{
                row[header]=values[index];
            })
            return row;
        })
        return new DataFrame(data);
    }

    // function to read json data
    static readJSON(filePath){
        const rawData=require(filePath);
        return new DataFrame(rawData);
    }

    // function to get column
    /**updated to accept all forms of data types such as 
     * float,integer && string
     */
    getColumn(columnName){
        return this.data.map((row)=>{
            const values=row[columnName];
          const parsedValue=parseFloat(values);
          return isNaN(parsedValue)? values : parsedValue;
        })
    }

    /**function to map data for data manipulations 
     * in json format
    */

    /***
     * use: const df=DataFrame.readJSON('data.json')
     * const myjson=df.map('price',price=>price * 3);
     * console.log(myjson.display());
     */
    map(columnName,mapFunction){
        return new DataFrame(this.data.map(row=>({
            ...row,[columnName]:mapFunction(row[columnName])
        })))
    }

    /**function to group column data in json */
    groupBy(colunmName){
        const groups={};
        this.data.forEach(row=>{
            const key=row[colunmName];
            if(!groups[key]){
                groups[key]=[];

            }
            groups[key].push(row);
        })
        return groups;
    }

    // function to get row
    getRow(rowIndex){
        return this.data[rowIndex];
    }

    // display data in row and column style
    display(){
        const columnNames=Object.keys(this.data[0]);
        console.log(columnNames.join('\t'));

        this.data.forEach(row=>{
            const values=columnNames.map(column=>row[column])
            console.log(values.join('\t'));
        })
    }

    // funtion to find mean on the class dataframe
    mean(columnName){
        const columnData=this.getColumn(columnName);
        const sum=columnData.reduce((acc,value)=>acc+value,0);
        return sum/columnData.length;

    }
    // function to filter data
    filter(conditionfunction){
        return new DataFrame(this.data.filter(row=>conditionfunction(row)))
    }

    /***function to display data in plotly */
    ScatterPlot(xColunmName,yColumnName,outputFilePath){
        const trace={
            x:this.getColumn(xColunmName),
            y:this.getColumn(yColumnName),
            type:"scatter",
            mode:"markers",
            marker:{size:12,color:'blue'},
        };

        const layout={
            title:`${xColunmName} vs ${yColumnName}`,
            xaxis:{title:xColunmName},
            yaxis:{title:yColumnName},

        };
        const figure={data:[trace],layout:layout};

        const imgOpts={
            format:'png',
            width:1000,
            height:500,
        }

        return new Promise((resolve,reject)=>{
            Plotly.newPlot(figure,imgOpts,(error,imageStream)=>{
                if(error){
                    reject(error);
                    return;
                }
                const imageFilePath=outputFilePath|| 'plot.png';
                fs.writeFile(imageFilePath,imageStream,'base64',err=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(imageFilePath)
                })
                
            })
        })
    }
}


module.exports=DataFrame;