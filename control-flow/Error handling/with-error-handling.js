try{
    //code that might cause an error
    let number="abc";
    let result=number*2;//NaN(not an Error)
    console.log("result", result);
    //this will cause error
    console.log(undeclaredVariable);//ReferenceError
    console.log("This lline will not be executed if an error occurs above");
}
catch(error){
    console.log("Error found!");
    console.log("Error name: ", error.name);
    console.log("Error message: ",error.message);
}
finally{
    console.log("Code finished running (with or without error");
}