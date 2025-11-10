// src/cms/cms.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cms, CmsDocument } from './schema/cms.schema';
import { CreateCmsDto } from './dto/create-cms.dto';
import { UpdateCmsDto } from './dto/update-cms.dto';

@Injectable()
export class CmsService {
    constructor(@InjectModel(Cms.name) private cmsModel: Model<CmsDocument>) { }

    async create(createDto: CreateCmsDto) {
        const created = new this.cmsModel(createDto);
        return created.save();
    }

    async findAll() {
        return this.cmsModel.find().sort({ order: 1 }).lean().exec();
    }

    async findBySection(section: string) {
        const doc = await this.cmsModel.findOne({ section }).lean().exec();
        if (!doc) throw new NotFoundException(`Section "${section}" not found`);
        return doc;
    }

    async updateBySection(section: string, updateDto: UpdateCmsDto) {
        const updated = await this.cmsModel
            .findOneAndUpdate({ section }, { $set: updateDto }, { new: true })
            .exec();

        if (!updated) throw new NotFoundException(`Section "${section}" not found`);
        return updated;
    }

    async removeBySection(section: string) {
        const res = await this.cmsModel.findOneAndDelete({ section }).exec();
        if (!res) throw new NotFoundException(`Section "${section}" not found`);
        return { deleted: true };
    }

    // REORDER LOGIC
    async reorder(sections: { id: string; order: number }[]) {
        const updates = sections.map(({ id, order }) =>
            this.cmsModel.updateOne({ _id: id }, { order })
        );
        await Promise.all(updates);
    }
}