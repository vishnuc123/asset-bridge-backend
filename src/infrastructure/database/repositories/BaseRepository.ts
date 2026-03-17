import mongoose, { Document, Model } from "mongoose";

export class BaseRepository<T extends Document> {
    constructor(protected model: Model<T>) { }

    async create(item: Partial<T>): Promise<T> {
        return this.model.create(item)
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec()
    }

    find(filter: mongoose.QueryFilter<T>): mongoose.Query<T[], T> {
        return this.model.find(filter)
    }

    findOne(filter: mongoose.QueryFilter<T>): mongoose.Query<T | null, T> {
        return this.model.findOne(filter);
    }

    async update(id: string, update: mongoose.UpdateQuery<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, update, { new: true }).exec()
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }
}