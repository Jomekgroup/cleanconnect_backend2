"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServices = void 0;
const express_1 = require("express");
// In a larger app, these would be in a DB table
const SERVICES = [
    "Residential/Domestic Cleaning",
    "Commercial/Office Cleaning",
    "Post-Construction",
    "Move-In / Move-Out Cleaning",
    "Disaster Cleaning & Restoration",
    "Carpet and Upholstery Cleaning",
    "Glass Cleaning",
    "Medical Cleaning",
    "Industrial Cleaning",
    "Vehicle Cleaning",
    "Event Cleaning",
    "Outdoor/Environmental Cleaning",
    "Hazardous Waste Cleaning",
    "Pest control",
    "Laundry & ironing",
    "Waste Management",
    "Deep Cleaning",
    "Regular/Routine",
    "Spring Cleaning",
    "Sanitization/Disinfection",
    "Green/Eco-Friendly",
    "Crisis/Trauma Cleaning"
];
const getServices = async (req, res) => {
    res.json(SERVICES);
};
exports.getServices = getServices;
//# sourceMappingURL=serviceController.js.map