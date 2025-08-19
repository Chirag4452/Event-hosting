import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    parent_name: {
        type: String,
        required: true,
    },
    parent_phone: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Level 1', 'Level 2', 'Level 3'],
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    // Payment information
    payment_details: {
        payment_id: {
            type: String,
            required: false, // Will be set after successful payment
        },
        order_id: {
            type: String,
            required: false,
        },
        amount_paid: {
            type: Number,
            required: false, // Amount in paise
        },
        currency: {
            type: String,
            default: 'INR',
        },
        payment_status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        payment_method: {
            type: String,
            required: false, // card, netbanking, wallet, etc.
        },
        verified_at: {
            type: Date,
            required: false,
        },
    },
    // Registration status
    registration_status: {
        type: String,
        enum: ['initiated', 'payment_pending', 'confirmed', 'cancelled'],
        default: 'initiated',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

export default User;
