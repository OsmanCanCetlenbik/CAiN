export interface SupabaseQueryResult<T = any> {
  data: T | T[] | null | undefined;
  error: unknown;
}

export interface SupabaseQueryBuilder<T = any>
  extends PromiseLike<SupabaseQueryResult<T>> {
  select(columns?: string): SupabaseQueryBuilder<T>;
  insert(values: Partial<T> | Partial<T>[]): SupabaseQueryBuilder<T>;
  update(values: Partial<T>): SupabaseQueryBuilder<T>;
  upsert(values: Partial<T> | Partial<T>[]): SupabaseQueryBuilder<T>;
  delete(): SupabaseQueryBuilder<T>;
  eq(column: string, value: unknown): SupabaseQueryBuilder<T>;
  order(column: string, options?: Record<string, unknown>): SupabaseQueryBuilder<T>;
  limit(count: number): SupabaseQueryBuilder<T>;
  maybeSingle(): Promise<SupabaseQueryResult<T>>;
  throwOnError(): Promise<SupabaseQueryResult<T>>;
  then<TResult1 = SupabaseQueryResult<T>, TResult2 = never>(
    onfulfilled?: ((value: SupabaseQueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2>;
}

export interface SupabaseAuthClient {
  signInWithPassword(credentials: Record<string, unknown>): Promise<{ data: unknown; error: unknown }>;
  signUp(credentials: Record<string, unknown>): Promise<{ data: unknown; error: unknown }>;
  signOut(): Promise<{ error: unknown }>;
  getSession(): Promise<{ data: unknown; error: unknown }>;
}

export interface SupabaseClient<T = any> {
  auth: SupabaseAuthClient;
  from<Table extends string>(table: Table): SupabaseQueryBuilder<T>;
}

export declare function createClient<T = any>(
  url: string,
  anonKey: string,
  options?: Record<string, unknown>
): SupabaseClient<T>;
