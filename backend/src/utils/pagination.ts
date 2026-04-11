import type { Request } from "express";

export const getPagination = (req: Request): {
    page: number;
    limit: number;
    skip: number;
} => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};