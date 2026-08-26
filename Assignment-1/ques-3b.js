let n = parseInt(prompt("Enter a number:"));
let count = 0;

for (let i = 1; i <= n; i++) {
    if (n % i === 0)
        count++;
}

if (n <= 1) {
    console.log(n + " is neither Prime nor Composite.");
}
else if (count === 2) {
    console.log(n + " is a Prime number.");
    console.log("Prime numbers up to " + n + ":");

    for (let i = 2; i <= n; i++) {
        let isPrime = true;

        for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }

        if (isPrime)
            console.log(i);
    }
}
else {
    console.log(n + " is a Composite number.");
}