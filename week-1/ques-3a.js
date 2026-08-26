const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter a number: ", function(num) {
    num = parseInt(num);
    let count = 0;

    for (let i = 1; i <= num; i++) {
        if (num % i === 0) {
            count++;
        }
    }

    if (num <= 1) {
        console.log(`${num} is neither Prime nor Composite`);
    }
    else if (count === 2) {
        console.log(`${num} is a Prime number`);
        console.log(`Prime numbers up to ${num}:`);

        for (let i = 2; i <= num; i++) {
            let isPrime = true;

            for (let j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) {
                    isPrime = false;
                    break;
                }
            }

            if (isPrime) {
                console.log(i);
            }
        }
    }
    else {
        console.log(`${num} is a Composite number`);
    }

    rl.close();
});