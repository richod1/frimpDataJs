const DataFrame=require("../src/Dataframe")

const data = [
    { name: 'Alice', age: 25, salary: 50000 },
    { name: 'Bob', age: 30, salary: 60000 },
    { name: 'Charlie', age: 28, salary: 55000 },
    // ... more data
  ];

const df= new DataFrame(data)
const findDataMean=df.mean('salary');
console.log("Mean Salary :",findDataMean);

console.log(df.display());

// example to get column index
const getIndex=df.getColumn('age');
console.log(getIndex);

// example to get specific row
const specific=df.getRow(1);
console.log(specific);

// e4xample to filter data
const filterData=df.filter(row=>parseFloat(row.age) > 25);
console.log(filterData.display());

// csv read file 
const read_csv=DataFrame.readCSV("salesData.csv");//add csv file here
console.log(read_csv.display());

// get single row data of csv file

const country=read_csv.getColumn("order_value_EUR");
console.log("order_value_EUR: ",country);

// applying getRow function of csv data
const getCsvRow=read_csv.getRow(2);
console.log("\ngetCsvRow:",getCsvRow,"\n");




// read json data
const read=DataFrame.readJSON('./data.json')
console.log(read.display());


