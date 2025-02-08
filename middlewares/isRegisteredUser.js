/* checks if the user's id doesn't match the id in the URL then throw an error */

import CardSchema from "../cards/models/Card.schema.js";

export const isRegisteredUser = (isCard) => async (req, res, next) => {
    const card = await CardSchema.findById(req.params.id);

    if (isCard && !card && req.user._id !== card.userId) {
        return res.status(403).json(
            { message: "You are not allowed to perform this action, you are not the authorized user !!!" }
        );
    }
    if (!isCard && req.user._id !== req.params.id) {
        return res.status(403).json(
            { message: "2You are not allowed to perform this action, you are not the authorized user !!!" }
        );
    } else return next();
};