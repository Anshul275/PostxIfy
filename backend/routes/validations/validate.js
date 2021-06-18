const Joi = require('@hapi/joi');


const registerValidation = (data) => {
    const validSchema = Joi.object({
        userId: Joi.string()
            .max(10)
            .required(),
        name: Joi.string()
            .max(20)
            .required(),
        email: Joi.string()
            .min(6)
            .max(30)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .max(20)
            .required(),
        bio: Joi.string()
            .max(75)
    });
    return validSchema.validate(data);
}

const loginValidation = (data) => {
    const validSchema = Joi.object({
        userId: Joi.string()
            .max(10)
            .required(),
        password: Joi.string()
            .min(6)
            .max(20)
            .required()
    });
    return validSchema.validate(data);
}

const forgotPassValidation = (data) => {
    const validSchema = Joi.object({
        userId: Joi.string()
            .max(10)
            .required()
    });
    return validSchema.validate(data);
}

const resetPassValidation = (data) => {
    const validSchema = Joi.object({
        userId: Joi.string()
            .max(10)
            .required(),
        password: Joi.string()
            .min(6)
            .max(20)
            .required(),
        otp: Joi.string()
            .max(6)
            .required()
    });
    return validSchema.validate(data);
}

const updateUserValidation = (data) => {
    const validSchema = Joi.object({
        name: Joi.string()
            .max(20),
        email: Joi.string()
            .min(6)
            .max(30)
            .email(),
        password: Joi.string()
            .min(6)
            .max(20),
        bio: Joi.string()
            .max(75)
    });
    return validSchema.validate(data);
}

const makePostValidation = (data) => {
    const validSchema = Joi.object({
        userId: Joi.string()
            .max(10)
            .required(),
        url: Joi.string()
            .required(),
        caption: Joi.string()
            .max(75)
            .required()
    });
    return validSchema.validate(data);
}

const updatePostValidation = (data) => {
    const validSchema = Joi.object({
        userId: Joi.string()
            .max(10)
            .required(),
        url: Joi.string(),
        caption: Joi.string()
            .max(75)
    });
    return validSchema.validate(data);
}

const like_unlike_PostValidation = (data) => {
    const validSchema = Joi.object({
        userId: Joi.string()
            .max(10)
            .required()
    });
    return validSchema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.forgotPassValidation = forgotPassValidation;
module.exports.resetPassValidation = resetPassValidation;
module.exports.updateUserValidation = updateUserValidation;
module.exports.makePostValidation = makePostValidation;
module.exports.updatePostValidation = updatePostValidation;
module.exports.like_unlike_PostValidation = like_unlike_PostValidation;