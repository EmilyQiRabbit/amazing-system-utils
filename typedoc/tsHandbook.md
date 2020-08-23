# 几条来自 TS 官网的代码示例

## 范型（Generics）

**Basic：**

```ts
// 1
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity;

// or...
// 2
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <U>(arg: U) => U = identity;

// or...
// 3
function identity<T>(arg: T): T {
    return arg;
}
// 使用「带有调用签名的对象字面量」的定义方法 ( a call signature of an object literal type )
let myIdentity: {<T>(arg: T): T} = identity;

// 这三种是一样的。
```

**更进一步，我们可以使用 interface：**

### 接口范型

```ts
interface GenericIdentityFn {
  <T>(arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

**然后，我们还可以把范型参数 T 作为 interface 的参数：**

```ts
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### 范型约束

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}

loggingIdentity(3);  // Error, number doesn't have a .length property

loggingIdentity({length: 10, value: 3});
```

#### 参数类型的范型约束

两个参数类型之间的约束：

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");
// Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

### 类的类型

```ts
function create<T>(c: { new (): T }): T {
  return new c();
}
// { new (): T } 规定了 c 参数的 constructor 签名
```

```ts
class BeeKeeper {
  hasMask: boolean;
}

class ZooKeeper {
  nametag: string;
}

class Animal {
  numLegs: number;
}

class Bee extends Animal {
  keeper: BeeKeeper;
}

class Lion extends Animal {
  keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```
