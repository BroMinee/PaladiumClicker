let nbIndent = 0;
const originalLog = console.log;
const originalDebug = console.debug;
const originalError = console.error;

function addIndent(args: string[]) {
  const indent = "    ".repeat(nbIndent);

  return args.map((arg: string, index: number) => {
    if (typeof arg === "string") {
      return arg.split("\n").map((line, i) =>
        i === 0 ? indent + line : indent + line
      ).join("\n");
    }
    return index === 0 ? indent + arg : arg;
  });
}

// Overload console.log
console.log = function(...args) {
  const indentedArgs = addIndent(args);
  originalLog.apply(console, indentedArgs);
};

// Overload console.debug
console.debug = function(...args) {
  const indentedArgs = addIndent(args);
  originalDebug.apply(console, indentedArgs);
};

// Overload console.error
console.error = function(...args) {
  const indentedArgs = addIndent(args);
  originalError.apply(console, indentedArgs);
};

/**
 * Decorator to log the execution of a method, including its start and end, with indentation to visualize nested calls.
 * @param target The prototype of the class.
 * @param propertyKey The name of the method.
 * @param descriptor The property descriptor of the method.
 * @returns The modified property descriptor with logging functionality.
 */
export function logExecution(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.debug(`[LOG] Exécution de ${propertyKey}`);
    nbIndent += 1;
    const result = originalMethod.apply(this, args);
    nbIndent -= 1;

    console.debug(`[LOG] ${propertyKey} terminé`);
    return result;
  };

  return descriptor;
}
