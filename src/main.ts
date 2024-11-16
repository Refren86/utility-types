// ==========================================================================================================
// Nullable
export type Nullable<T> = T | null | undefined;

// Як працює:
// 1. Використовує union type (|) для додавання null та undefined як можливих типів
// 2. Зберігає оригінальний тип T як один з можливих варіантів

// Приклад:
type NullableTestType = { id: string; name: string; quantity: number };
type NullableData = Nullable<NullableTestType>;

// Use cases:
const userData: NullableData = null;
const userDataUndef: NullableData = undefined;
const userDataFull: NullableData = {
  id: "1",
  name: "John",
  quantity: 5,
};

// ==========================================================================================================

// ObjectType
export type ObjectType<T = any, P extends PropertyKey = PropertyKey> = Record<
  P,
  T
>;

// Як працює:
// 1. Використовує тип Record для створення об'єкта
// 2. P extends PropertyKey обмежує ключі до допустимих типів (string | number | symbol)
// 3. T = any дженерік дозволяє будь-який тип
// 4. P extends PropertyKey = PropertyKey встановлює тип ключа за замовчуванням

// Приклад:
type ObjectTypeTestType = {
  id: string;
  name: string;
  quantity: number;
};

type DataType = ObjectType<ObjectTypeTestType, "data">;

// ==========================================================================================================

// Dictionary і NumericDictionary
type Dictionary<T> = ObjectType<T, string>;
type NumericDictionary<T> = ObjectType<T, number>;

// Як працює:
// Dictionary:
// - Створює об'єкт з ключами з типом string
// NumericDictionary:
// - Створює об'єкт з ключами з типом number

// Приклади:
type StringDict = Dictionary<number>;
type NumDict = NumericDictionary<string>;

// ==========================================================================================================

// PickKeysByType
type PickKeysByType<T extends ObjectType, N> = {
  [K in keyof T as T[K] extends N ? K : never]: T[K];
};

// Як працює:
// 1. [K in keyof T] - ітерується по всіх ключах T
// 2. as T[K] extends N ? K : never - умовний тип, який:
//    - залишає ключ K якщо тип значення T[K] розширює N
//    - видаляє ключ (never) якщо умова не виконується
// 3. Зберігає оригінальні значення T[K] для ключів що залишились

// Приклад:
type PickKeysByTypeTestType = {
  id: string;
  name: string;
  quantity: number;
};

type NumberKeys = PickKeysByType<PickKeysByTypeTestType, number>;

// ==========================================================================================================

// OmitKeysByType
type OmitKeysByType<T extends ObjectType, N> = {
  [K in keyof T as T[K] extends N ? never : K]: OmitKeysByType<T[K], N>;
};

// Як працює:
// 1. [K in keyof T] - ітерується по всіх ключах T
// 2. as T[K] extends N ? never : K - умовний тип, який:
//    - видаляє ключ (never) якщо тип значення T[K] розширює N
//    - залишає ключ K якщо умова не виконується
// 3. Рекурсивно застосовує OmitKeysByType до вкладених об'єктів

// Приклад:
type OmitKeysByTypeTestType = {
  id: number;
  name: string;
  isActive: boolean;
  metadata: {
    createdAt: string;
    count: number;
    tags: string[];
    config: {
      enabled: boolean;
      value: number;
    };
  };
};

type NonNumberKeys = OmitKeysByType<OmitKeysByTypeTestType, number>;

// ==========================================================================================================

// PartialBy
export type PartialBy<T extends ObjectType, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Як працює:
// 1. Omit<T, K> - забирає ключі K типу T, який розширяється від ObjectType
// 2. Partial<Pick<T, K>> - робить вибрані ключі K опціональними
// 3. & об'єднує два вищевказані типи

type PartialByTestType = {
  id: number;
  name: string;
  email: string;
};

// Приклад використання:
type PartialByEmailAndName = PartialBy<PartialByTestType, "email" | "name">;

// ==========================================================================================================

// PartialExcept
type PartialExcept<T extends ObjectType, K extends keyof T> = Partial<
  Omit<T, K>
> &
  Required<Pick<T, K>>;

// Як працює:
// 1. Partial<Omit<T, K>> - робить всі поля крім K опціональними
// 2. Required<Pick<T, K>> - робить вказані поля K обов'язковими
// 3. об'єднує результати

type PartialExceptTestType = {
  id?: number;
  name?: string;
  email?: string;
};

// Приклад використання:
type PartialExceptID = PartialExcept<PartialExceptTestType, "id">;

// ==========================================================================================================

export type PartialNullable<T> = {
  [P in keyof T]?: Nullable<T[P]>;
};

// Як працює:
// 1. Mapped type проходить по всіх ключах
// 2. Робить кожне поле опціональним (?)
// 3. Застосовує Nullable до кожного значення (значення кожного ключа може бути як null так і undefined)

type PartialNullableTestType = {
  id: number;
  name: string;
  email: string;
};

// Приклад:
type PartialNullableFields = PartialNullable<PartialNullableTestType>;

// ==========================================================================================================

// PartialNullableBy
export type PartialNullableBy<T extends ObjectType, K extends keyof T> = Omit<
  T,
  K
> &
  PartialNullable<Pick<T, K>>;

// Як працює:
// 1. Omit<T, K> - видаляє вказані поля K
// 2. PartialNullable<Pick<T, K>> - робить вказані поля (K) опціональними, nullable та undefined
// 3. об'єднує результати

type PartialNullableByTestType = {
  id: number;
  name: string;
  email: string;
};

// Приклад:
type PartialNullableByEmail = PartialNullableBy<
  PartialNullableByTestType,
  "email"
>; // email буде Nullable

// ==========================================================================================================

// PartialKeys
export type PartialKeys<T extends ObjectType> = {
  [K in keyof T]?: Partial<T[K]>;
};

// Як працює:
// 1. Mapped type проходить по всіх ключах
// 2. Робить кожне поле опціональним
// 3. Застосовує Partial до значення кожного поля (дочірні об'єкти також будуть мати всі поля опціональними - але лише на першому рівні вкладеності)

type PartialKeysTestType = {
  id: number;
  name: string;
  email: string;
  child: {
    id: number;
    name: string;
    email: string;
  };
};

// Приклад:
type PartialKeysTest = PartialKeys<PartialKeysTestType>;

// ==========================================================================================================

// NonNullableKeys
export type NonNullableKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

// Як працює:
// 1. Mapped type проходить по всіх ключах
// 2. -? забирає опціональність кожного ключа
// 3. Вбудований NonNullable прибирає null і undefined зі всіх значень полів

type NonNullableTestType = {
  id?: number;
  name: string | null;
  email?: string | null | undefined;
};

// Приклад:
type NonNullableKeysTest = NonNullableKeys<NonNullableTestType>;

// ==========================================================================================================

// UnionToObject
type UnionToObject<T extends string> = ObjectType<never, T>;

// Як працює:
// 1. Приймає T як string (union)
// 2. Використовує ObjectType для перетворення union в об'єктний тип
// 3. never буде використаний як значення для всіх ключів
// 4. T як другий параметр вказує, що ключами будуть значення з union типу

// Приклад:
type ColorsUnion = 'red' | 'green' | 'blue';
type ColorsObject = UnionToObject<Colors>;

// ==========================================================================================================

type PickUnion<T extends string, K extends keyof UnionToObject<T>> = keyof Pick<
  UnionToObject<T>,
  K
>;

// Як працює:
// 1. Приймає union тип T і можливі його значення - K (також union)
// 2. UnionToObject<T> перетворює union в об'єкт
// 3. Pick вибирає тільки вказані ключі K з цього об'єкта
// 4. keyof повертає union тип з ключів результуючого об'єкта

// Приклад:
type PickedUnionColors = PickUnion<Colors, 'red' | 'blue'>;

// ==========================================================================================================

type OmitUnion<T extends string, K extends keyof UnionToObject<T>> = keyof Omit<
  UnionToObject<T>,
  K
>;

// Як працює:
// PickUnion вибирає певні значення з union типу, а OmitUnion видаляє певні значення з union типу

// Приклад:
type Colors = "red" | "green" | "blue";
type OmittedColors = OmitUnion<Colors, "red">;

// ==========================================================================================================

export type EndpointParamType = string | number;

// ExtractEndpointParams
export type ExtractEndpointParams<T extends string> = string extends T
  ? null
  : T extends `${string}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractEndpointParams<Rest>]: EndpointParamType }
  : T extends `${string}:${infer Param}`
  ? { [k in Param]: EndpointParamType }
  : null;

// Як працює:
// 1. Витягує динамічні параметри з урли і створює об'єкт з цих параметрів використовуючи template literal types
// 2. Якщо T — це загальний тип string (тобто не конкретний роут) то результатом буде null
// 3. Якщо в URL є "щось:параметр/щось-ще" - рекурсивно обробляє урлу, допоки виконується умова і повертає об'єкт,
//    в якому ключем буде поточний параметр, або рекурсивно витягнуті ключі з Rest
// 4. Якщо в URL є "щось:параметр" створює об'єкт з цим параметром
// 5. В інших випадках повертає null

// Приклад:
type Params = ExtractEndpointParams<"/users/:id/posts/:postId">;

// ==========================================================================================================

// TupleIntoPath
export type TupleIntoPath<
  T extends Array<string | number>,
  S extends string = "."
> = T extends [infer A, ...infer Tail]
  ? A extends string | number
    ? Tail extends Array<string | number>
      ? Tail extends []
        ? A
        : `${A}${S}${TupleIntoPath<Tail, S>}`
      : never
    : never
  : never;

// Як працює:
// 1. Приймає масив (tuple) строк або чисел і роздільник (за замовчуванням ".")
// 2. Використовує рекурсивний pattern matching для розбору tuple:
//      T extends [infer A, ...infer Tail] - розділяє tuple на перший елемент (A) і все інше (Tail)
// 3. Перевіряє, чи A є string або number
// 4. Перевіряє, чи Tail є масивом string або number
// 5. Якщо Tail пустий ([]) - повертає A
// 6. Інакше - з'єднує A, роздільник S і рекурсивно обробляє Tail

// Приклади:
type Path1 = TupleIntoPath<["user", "profile", "name"]>;
type Path2 = TupleIntoPath<["posts", 123, "comments"], "/">;
