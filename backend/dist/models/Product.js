"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.UpdateProductSchema = exports.CreateProductSchema = exports.ProductSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const zod_1 = require("zod");
exports.ProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    price: zod_1.z.number().positive('Price must be positive'),
    category: zod_1.z.string().min(1, 'Category is required'),
    brand: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string().url()).default([]),
    stock: zod_1.z.number().int().min(0, 'Stock cannot be negative').default(0),
    isActive: zod_1.z.boolean().default(true),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    specifications: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CreateProductSchema = exports.ProductSchema.omit({ createdAt: true, updatedAt: true });
exports.UpdateProductSchema = exports.ProductSchema.partial().omit({ createdAt: true, updatedAt: true });
const mongooseProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    brand: {
        type: String,
        trim: true,
    },
    images: [{
            type: String,
        }],
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    tags: [{
            type: String,
            trim: true,
        }],
    specifications: {
        type: Map,
        of: String,
    },
}, {
    timestamps: true,
});
mongooseProductSchema.index({ name: 'text', description: 'text' });
mongooseProductSchema.index({ category: 1 });
mongooseProductSchema.index({ price: 1 });
mongooseProductSchema.index({ isActive: 1 });
exports.Product = mongoose_1.default.model('Product', mongooseProductSchema);
//# sourceMappingURL=Product.js.map