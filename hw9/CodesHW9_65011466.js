let result = document.getElementById('result');
let userInput = '';
let display = '';
let memory = 0; // Initialize memory to 0

const operators = [
    '+',
    '-',
    '*',
    '/',
    'sin',
    'cos',
    'tan',
    'sqrt',
    'square',
    'mc',
    'm+',
    'm-',
    'mr',
    '!',
];
    
document.addEventListener('keypress', (event) => {
        console.log("key I clicked", event.key);
        console.log(userInput);
        if (event.key === 'Enter') {

            // If the Enter key is pressed, display the collected input and reset it.
            if(userInput==='')
                result.innerHTML = 0;
            else{
                display += calculatePtkVer(userInput)
                result.innerHTML = display;
                userInput = '';
                display = '';
                
            }
                
            userInput = '';
        } 
        else if (event.key === '<') {
            // Handle the backspace key by removing the last character from userInput and updating the display.
            userInput = userInput.slice(0, -1);
            result.innerHTML = userInput;
        }
        else {
            // Append the pressed key to the userInput variable.
            userInput += event.key;
            result.innerHTML = userInput;

        }
        
    });
    function tokenizeExpression(expression) {
        // Regular expression to match numbers, operators, and functions
        const tokenRegex = /(\d+\.\d+|\d+|[-+*/()^]|(sin|cos|tan|log|sqrt|square|!|mc|m\+|m-|mr))/g;
    
        // Tokenize the expression using the regex
        const tokens = expression.match(tokenRegex);
    
        // Clean up the tokens
        const cleanedTokens = tokens.map(token => token.trim());
    
        return cleanedTokens;
    }

    // Function to determine the precedence of operators
    function getPrecedence(operator) {
        // Define the precedence of operators as per your requirements
        // Higher values indicate higher precedence
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2,
            'sin': 3,
            'cos': 3,
            'tan': 3,
            'sqrt': 3,
            'square': 3,
            'mc': 4,
            'm+': 4,
            'm-': 4,
            'mr': 4,
            '!': 5,
        };
        return precedence[operator] || 0;
    }
    function calculatePtkVer(expression){
        // Replace the string "π" with the actual value of Math.PI
        //expression = expression.replace(/π/g, Math.PI.toString());
        console.log("Expression ",expression);

        let cleanedTokens = tokenizeExpression(expression);
        
        console.log(cleanedTokens);
        const outputQueue = [];
        const operatorStack = [];
        for (let token of cleanedTokens) {
            if (operators.includes(token)) {
                    while (
                        operatorStack.length > 0 &&
                        getPrecedence(operatorStack[operatorStack.length - 1]) >= getPrecedence(token)
                    ) {
                        outputQueue.push(operatorStack.pop());
                    }
                    operatorStack.push(token);
                 }   
            else {
                outputQueue.push(token);
            }
        }
    
        // Pop any remaining operators from the stack to the output queue
        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }
    
        console.log("Output Queue (RPN):", outputQueue);
        
        return calculateRPN(outputQueue);
        // Return the result of the RPN expression evaluation
     

    }

    function calculateRPN(rpnExpression) {
        const stack = [];
    
        for (let token of rpnExpression) {
            if (!isNaN(token)) {
                // If the token is a number, push it onto the stack
                stack.push(parseFloat(token));
            } 
            else if (operators.includes(token)) {
                // If the token is an operator, pop the required number of operands
                // from the stack, perform the operation, and push the result back onto the stack
                const operand2 = stack.pop();
                const operand1 = stack.pop();
    
                switch (token) {
                    case '+':
                        stack.push(operand1 + operand2);
                        break;
                    case '-':
                        stack.push(operand1 - operand2);
                        break;
                    case '*':
                        stack.push(operand1 * operand2);
                        break;
                    case '/':
                        stack.push(operand1 / operand2);
                        break;
                    case 'sin':
                        stack.push(Math.sin(operand2));
                        break;
                    case 'cos':
                        stack.push(Math.cos(operand2));
                        break;
                    case 'tan':
                        stack.push(Math.tan(operand2));
                        break;
                    case 'sqrt':
                        stack.push(Math.sqrt(operand2));
                        break;
                    case 'square':
                        stack.push(operand2 * operand2);
                        break;
                    case 'mc':
                        // memory clear, reset the only memory of the calculator to 0
                        memory = 0; // Memory Clear
                        stack.push(memory);
                        break;
                    case 'm+':
                        // memory add, to take the number on the display, adds it to the memory, and pust the results into memory.
                        memory += stack.pop(); // Memory Add
                        stack.push(memory);
                        break;
                    case 'm-':
                        // memory subtract, to take the number on the display, subtracts it with the number in the memory, and puts the result into the memory
                        memory -= stack.pop(); // Memory Subtract
                        stack.push(memory);
                        break;
                    case 'mr':
                        // memory recall, take the number from memory, and treat it as if you just type it in to the calculator
                        stack.push(memory); // Memory Recall
                        break;
                    case '!':
                        // Implement factorial operation '!'
                        let result = 1;
                        for (let i = 2; i <= operand2; i++) {
                            result *= i;
                        }
                        stack.push(result);
                        break;
                }
            }
        }
    
        // The final result should be on the stack
        return stack[0];
    }

    //console.log(calculateRPN(outputQueue));
    
    
document.getElementById('myTable').onclick = function(event) {
    if (event.target.id == 'Enter') {
        display = calculatePtkVer(userInput);
        result.innerHTML = display;
    } else if (event.target.id == 'Backspace') {
        userInput = userInput.slice(0, -1);
        result.innerHTML = userInput;
    } else if (event.target.id == 'c') {
        result.innerHTML = 0;
        userInput = '';
    } 
    else if (event.target.id == 'π') {
        userInput += Math.PI;
        result.innerHTML = userInput;
    } 
    else if (event.target.id == 'mr') {
        result.innerHTML = userInput;
        lastOperationWasMemory = true;
    } else if (event.target.id == 'm+') {
        userInput += '+';
        result.innerHTML = userInput;
    } else if (event.target.id == 'm-') {
        userInput += '-';
        result.innerHTML = userInput;
    } else if (event.target.id == 'mc') {
        result.innerHTML = 0;
        userInput = '';
        
    }
    else {
        userInput += event.target.id;
        result.innerHTML = userInput;
    }
    console.log("Result ",result);
    console.log("UserInput ",userInput);
}


