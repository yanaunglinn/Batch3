//Example1: double the numbers in an array
const numbers=[1, 2, 3, 4];
const double=numbers.map((num) => {
    return num*2;// must be return
})
console.log("Original array: ", numbers);
console.log(double);//[2, 4, 6, 8] new array

//Example 2: extract names from an array of objects
const users=[
    {name: "Alice", age: 21 }, //index=0
    {name: "Bob", age:25 },    //index=1
];
const names=users.map((user) =>user.name);

console.log(names);//["Alice", "Bob"]
console.log(users);