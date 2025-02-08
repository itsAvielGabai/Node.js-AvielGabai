import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true,
        },
        middle: {
            type: String,
        },
        last: {
            type: String,
            required: true,
        },
    },
    image: {
        url: {
            type: String,
            required: false
        },
        alt: {
            type: String,
            required: false
        }
    },
    isBusiness: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: false
        },
        zip: {
            type: Number,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        houseNumber: {
            type: String,
            required: true
        },
    },
    phone: {
        type: String,
        required: true
    }
});

export default model("user", userSchema);


/* model:  Converts the schema into a model, which is like a blueprint to interact with the MongoDB database.
The model allows you to create, read, update, and delete documents (CRUD operations) in a MongoDB collection.  */