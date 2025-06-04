"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    if (req.body.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
exports.isAdmin = isAdmin;
