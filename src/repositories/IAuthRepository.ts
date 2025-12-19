export interface IAuthRepository<T> {
  create(data: any): Promise<T>;
  update(data: any): Promise<T>;
  findById(id: number): Promise<T | null>;
  findByEmail(email: string): Promise<T | null>;
}
