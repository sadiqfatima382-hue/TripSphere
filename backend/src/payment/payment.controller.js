import { createPaymentService, getPaymentByIdService, getCustomerPaymentsService, getAllPaymentsService, deletePaymentService, } from "../payment/payment.service.js";

// Create Payment
export const createPayment = async (req, res, next) => {
    try {
        const customerId = req.user.id;

        const payment = await createPaymentService(customerId, req.body);

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

// Get Payment By ID
export const getPaymentById = async (req, res, next) => {
    try {
        const payment = await getPaymentByIdService(
            req.params.id,
            req.user.id,
            req.user.role
        );

        return res.status(200).json({
            success: true,
            message: "Payment fetched successfully",
            data: payment,
        });
    } catch (error) {
        next(error);
    }
};

// Get Customer Payments
export const getCustomerPayments = async (req, res, next) => {
    try {
        const customerId = req.user.id;

        const result = await getCustomerPaymentsService(
            customerId,
            req.validatedQuery
        );

        return res.status(200).json({
            success: true,
            message: "Customer payments fetched successfully",
            data: result.payments,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

// Get All Payments
export const getAllPayments = async (req, res, next) => {
    try {
        const result = await getAllPaymentsService(req.validatedQuery);

        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            data: result.payments,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

// Delete Payment
export const deletePayment = async (req, res, next) => {
    try {
        await deletePaymentService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};