Розібратись з типами які я напишу і відповісти на такі питання як
Що робить кожен Utility Type
Як саме воно працює (чому саме такий запис привів до того що вона так працює в TS)
Use-case (optional)
Приклад:
Дано тип:
export type ArrayElement<A> = A extends any[] ? A[number] : A;
Що робить - повертає тип елементів массиву
type Test = [string, number, { someStr: "someStr" }]

type Result = ArrayElement<Test> // -> string | number | {someStr: "someStr"}

// Якщо ж прокинути не массив поверне прокинутий тип як результат

type Result1 = ArrayElement<{ someSrt: "someStr" }> // -> {someSrt: "someStr"}
Як працює - Indexed Access Types
Задачі:
export type Nullable<T> = T | null | undefined;


export type ObjectType<T = any, P extends PropertyKey = PropertyKey> = Record<P, T>;

export type Dictionary<T> = ObjectType<T, string>;

export type NumericDictionary<T> = ObjectType<T, number>;

export type PickKeysByType<T extends ObjectType, N> = {
  [K in keyof T as T[K] extends N ? K : never]: T[K];
};
export type OmitKeysByType<T extends ObjectType, N> = {
  [K in keyof T as T[K] extends N ? never : K]: OmitKeysByType<T[K], N>;
};

export type PartialBy<T extends ObjectType, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartialExcept<T extends ObjectType, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;

export type PartialNullable<T> = {
  [P in keyof T]?: Nullable<T[P]>;
};

export type PartialNullableBy<T extends ObjectType, K extends keyof T> = Omit<T, K> &
  PartialNullable<Pick<T, K>>;
  
export type PartialKeys<T extends ObjectType> = {
  [K in keyof T]?: Partial<T[K]>;
};

export type NonNullableKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

type UnionToObject<T extends string> = ObjectType<never, T>;

export type PickUnion<T extends string, K extends keyof UnionToObject<T>> = keyof Pick<
  UnionToObject<T>,
  K
>;

export type OmitUnion<T extends string, K extends keyof UnionToObject<T>> = keyof Omit<
  UnionToObject<T>,
  K
>;
export type EndpointParamType = string | number;

export type ExtractEndpointParams<T extends string> = string extends T
  ? null
  : T extends `${string}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractEndpointParams<Rest>]: EndpointParamType }
  : T extends `${string}:${infer Param}`
  ? { [k in Param]: EndpointParamType }
  : null;
export type Join<K, P, S extends string = "."> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : S}${P}`
    : never
  : never;
export type TupleIntoPath<T extends Array<string | number>, S extends string = "."> = T extends [infer A, ...infer Tail]
  ? A extends string | number
    ? Tail extends Array<string | number>
      ? Tail extends []
        ? A
        : `${A}${S}${TupleIntoPath<Tail, S>}`
      : never
    : never
  : never;
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

export type PathsOf<T, S extends string = ".", D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, PathsOf<T[K], S, Prev[D]>, S> : never;
      }[keyof T]
    : "";

export type LeavesOf<T, S extends string = ".", D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
    ? { [K in keyof T]-?: Join<K, LeavesOf<T[K], S, Prev[D]>, S> }[keyof T]
    : "";
export type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [T, ...Split<U, D>]
      : [S];