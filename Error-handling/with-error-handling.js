try{
    let number ="abc";
    let result = number * 2;
    console.log("Result : "+result);
    //but this will be cause an error
    console.log(undecleareVariable);
    console.log("This line will not be executed if an error occur about");
}catch(error){
    console.log("Error Found!!!");
    console.log("Error Name : "+ error.name);
    console.log("Error message : "+error.message);
}finally{
    console.log("Code finished running (with or wothout error)");