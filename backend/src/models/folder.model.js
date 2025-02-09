import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const folderSchema = new Schema({
    name: { type: String, required: true },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    children: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
    files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
    workspaceId: { type: Schema.Types.ObjectId, ref: 'WorkSpace' },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
}, {
    timestamp:true,
});

export const Folder = mongoose.model('Folder', folderSchema);
