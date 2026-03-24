export interface IBaseRepository<T> {
    create(item: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    find(filter: any): any;
    findOne(filter: any): any;
    update(id: string, update: any): Promise<T | null>;
    delete(id: string): Promise<T | null>;
}