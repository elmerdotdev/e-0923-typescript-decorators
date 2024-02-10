function factory(info: string) {
  console.log('received info: ' + info);
  return function (target: any) {
    console.log('apply decorator to: ' + target);
    return target
  }
}

@factory('some info')
class A {}


///////////

const Logger = (logString: string) => {
  console.log('LOGGER FACTORY');
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

@Logger('LOGGING - PERSON')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const person = new Person()
console.log(person)


@Logger('LOGGING - PRODUCT')
class Item {
  name = 'Soap';

  constructor() {
    console.log('Creating product object...');
  }
}

const item = new Item()
console.log(item)


////////////


const WithTemplate = (template: string, hookId: string) => {
  console.log('TEMPLATE FACTORY');
  return (constructor: any) => {
    const hookEl = document.getElementById(hookId);
    const p = new constructor("Jane");
    console.log(p.name)
    if(hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  }
}

@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person2 {
  name: string;

  constructor(name: string) {
    this.name = name;
    console.log('Creating person object...');
  }
}

const person2 = new Person2('John')

////////

const WithTemplate2 = (template: string, hookId: string) => {
  return <T extends {new(...args: any[]): {name: string}}>(originalConstructor: T) => {
  
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        const hookEl = document.getElementById(hookId)

        if (hookEl) {
          hookEl.innerHTML = template
          hookEl.querySelector('h1')!.textContent = this.name
        }
      }
    }
  }
}

@WithTemplate2('<h1>My Person Object</h1>', 'app')
class Person3 {
  name = 'John'

  constructor() {
    console.log('Creating person object...');
  }
} 

const person3 = new Person3()

console.log(person3)



/////////

const Logger3 = (logString: string) => {
  console.log('LOGGER FACTORY');
  return (constructor: Function) => {
    console.log(logString);
    console.log(constructor);
  };
}

const WithTemplate3 = (template: string, hookId: string) => {
  console.log('TEMPLATE FACTORY');

  return (constructor: any) => {
    console.log('Rendering template');

    const hookEl = document.getElementById(hookId);
    const p = new constructor()

    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  }
}

@Logger3('LOGGING - PERSON')
@WithTemplate3('<h1>My Person Object</h1>', 'app')
class Person4 {
  name = 'John'

  constructor() {
    console.log('Creating person object...');
  }
}

const person4 = new Person4()












//////////////////

const Log = (target: any, propertyName: string) => {
  console.log('Property decorator');
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;
  
  private _price: number;

  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Invalid price - should be positive!")
    }
  }

  constructor(t: string, p: number) {
    this.title = t
    this._price = p
  }

  getPriceWithTax(tax: number) {
    return this._price * (1 + tax)
  }
}

const p1 = new Product('Book', 19)
console.log(p1.getPriceWithTax(0.3))

const p2 = new Product('Book 2', 29)
console.log(p2.getPriceWithTax(0.3))


//////////

const Log2 = (target: any, name: string, descriptor: PropertyDescriptor) => {
  console.log('Accessor decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

class Product2 {
  private _price: number;

  constructor(p: number) {
    this._price = p;
  }

  get price() {
    return this._price;
  }

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Invalid price - should be positive!")
    }
  }
}


/////////

const Log3 = (target: any, name: string, descriptor: PropertyDescriptor) => {
  console.log('Method decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

class Product3 {
  private _price: number;

  constructor(p: number) {
    this._price = p;
  }

  @Log3
  getPriceWithTax(tax: number) {
    return this._price * (1 + tax)
  }
}

/////////

const Autobind = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  console.log('Autobind decorator!');
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      console.log("this", this)
      const boundFn = originalMethod.bind(this)
      return boundFn;
    }
  }
  return adjDescriptor;
}

class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log("hey")
    console.log(this.message)
  }
}

const p = new Printer()
p.showMessage()







//

const obj = {};
Object.defineProperty(obj, 'prop', {
  value: 10,
  configurable: false
});
delete obj.prop; // Will not delete the property because configurable is false
console.log(obj.prop); // Outputs: 10


//

const obj2 = {};
Object.defineProperty(obj, 'hidden', {
  value: 'hidden value',
  enumerable: false
});
Object.defineProperty(obj, 'visible', {
  value: 'visible value',
  enumerable: true
});

for (let key in obj) {
  console.log(key); // Will only log 'visible'
}

console.log(Object.keys(obj)); // Outputs: ['visible']





////// PRACTICAL USES

// Class Decorator: Logs the creation of a class instance
function LogClassCreation(constructor: Function) {
  console.log(`${constructor.name} was created`);
}

@LogClassCreation
class User {
  constructor(public name: string) {}
}
const user = new User("John"); // Logs "User was created"

// Method Decorator: Measures and logs the execution time of a method
function MeasureExecutionTime(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${key} executed in ${end - start} milliseconds`);
    return result;
  };
}

class Calculator {
  @MeasureExecutionTime
  add(a: number, b: number) {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(5, 3); // Logs execution time of "add"


// Method Decorator: Prevent method execution
function PreventMethodExecution(target: any, key: string, descriptor: PropertyDescriptor) {
  // Save a reference to the original method
  const originalMethod = descriptor.value;

  // Replace the original method with a new function that does nothing
  descriptor.value = function(...args: any[]) {
    // Here, you could add conditions to decide whether to prevent execution
    console.log(`${key} execution prevented.`);
    
    // Original method is not called, effectively preventing its execution
    // Uncomment the next line to conditionally execute the original method
    // return originalMethod.apply(this, args);
  };
}

class Greeter {
  @PreventMethodExecution
  greeting() {
    console.log('hello');
  }
}

const greeter = new Greeter();
greeter.greeting(); // Outputs: "greeting execution prevented."



// Accessor Decorator: Logs changes when a property's value is set
function LogPropertyChange(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const originalSetter = descriptor.set;
  descriptor.set = function(newValue) {
    console.log(`Changing ${propertyName} to ${newValue}`);
    originalSetter.call(this, newValue);
  };
}

class Profile {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  @LogPropertyChange
  set name(value: string) {
    this._name = value;
  }

  get name() {
    return this._name;
  }
}

const profile = new Profile("John");
profile.name = "Jane"; // Logs "Changing name to Jane"

// Property Decorator: Assigns a default value if none is provided
function DefaultValue(value: any) {
  return function(target: any, propertyName: string) {
    let val = value;

    const getter = () => val;
    const setter = (next: any) => { val = next; };

    Object.defineProperty(target, propertyName, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class Config {
  @DefaultValue(42)
  public defaultNumber: number;
}

const config = new Config();
console.log(config.defaultNumber); // Logs 42, the default value



///// 








// Example JavaScript/TypeScript file with Decorator usage

// Simple Class Decorator: Adds a new property to a class
function AddRole(role) {
  return function(constructor) {
    constructor.prototype.role = role;
  };
}

@AddRole('admin') // This will add a 'role' property with the value 'admin' to the User class
class User {
  constructor(public name: string) {}
}

const adminUser = new User("John");
console.log(adminUser.role); // Logs 'admin'

// Method Decorator: Logs a message before calling a method
function LogMethodCall(target, key, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args) {
    console.log(`Calling ${key} with args: ${args.join(', ')}`);
    return originalMethod.apply(this, args);
  };
}

class Calculator {
  @LogMethodCall // This decorator will log a message every time the add method is called
  add(a, b) {
    return a + b;
  }
}

const calc = new Calculator();
console.log(calc.add(2, 3)); // Logs "Calling add with args: 2, 3" then 5

// Accessor Decorator: Validates a property's new value before setting it
function ValidateNonNegative(target, propertyKey, descriptor) {
  const originalSet = descriptor.set;
  descriptor.set = function(value) {
    if (value < 0) {
      throw new Error(`${propertyKey} cannot be negative`);
    }
    originalSet.call(this, value);
  };
}

class Account {
  private _balance: number;

  constructor(balance: number) {
    this._balance = balance;
  }

  @ValidateNonNegative // This decorator ensures that balance can never be set to a negative value
  set balance(value: number) {
    this._balance = value;
  }

  get balance() {
    return this._balance;
  }
}

const account = new Account(100);
console.log(account.balance); // Logs 100
account.balance = 50; // Works fine
try {
  account.balance = -10; // Throws error
} catch (error) {
  console.log(error.message); // Logs "balance cannot be negative"
}

// Property Decorator: Logs when a new value is assigned to a property
function LogPropertyChange(target, propertyName) {
  let value = target[propertyName];

  Object.defineProperty(target, propertyName, {
    get: function() {
      return value;
    },
    set: function(newValue) {
      console.log(`Setting ${propertyName} to ${newValue}`);
      value = newValue;
    },
    enumerable: true,
    configurable: true
  });
}

class Profile {
  @LogPropertyChange // This decorator will log a message whenever the name property is changed
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const profile = new Profile("John");
profile.name = "Jane"; // Logs "Setting name to Jane"
