import { createCouponService, getCouponByIdService, getCouponByCodeService, getAllCouponsService, updateCouponService, deleteCouponService, applyCouponService, recordCouponUsageService, } from "../coupon/coupon.service.js";

export async function createCouponController(req, res, next) {
    try {
        const coupon = await createCouponService(req.body);

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: coupon,
        });
    } catch (error) {
         return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export async function getCouponByIdController(req, res, next) {
    try {
        const coupon = await getCouponByIdService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Coupon retrieved successfully",
            data: coupon,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
   
}

export async function getCouponByCodeController(req, res, next) {
    try {
        const coupon = await getCouponByCodeService(
            req.params.code
        );

        return res.status(200).json({
            success: true,
            message: "Coupon retrieved successfully",
            data: coupon,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    
}

export async function getAllCouponsController(req, res, next) {
    try {
        const result = await getAllCouponsService(
            req.validatedQuery ?? req.query
        );

        return res.status(200).json({
            success: true,
            message: "Coupons retrieved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    
    }
}

export async function updateCouponController(req, res, next) {
    try {
        const coupon = await updateCouponService(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: coupon,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    
    }
}

export async function deleteCouponController(req, res, next) {
    try {
        const coupon = await deleteCouponService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Coupon deactivated successfully",
            data: coupon,
        });
    } catch (error) {
       return res.status(500).json({
            success: false,
            message: error.message,
        });
    
    }
}

export async function applyCouponController(req, res, next) {
    try {
        const { bookingId, code } = req.body;

        const result = await applyCouponService(
            req.user.id,
            bookingId,
            code
        );

        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    
    }
}

