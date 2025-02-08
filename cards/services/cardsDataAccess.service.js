import Card from "../models/Card.schema.js";

/* ----- POST create a new card request ----- */
const createNewCard = async (cardData) => {
    try {
        const newCard = new Card(cardData);
        if (!cardData) {
            throw new Error("Card Was Not Created");
        };
        if (!cardData.bizNumber) {
            newCard.bizNumber = Math.floor(100000 + Math.random() * 900000);
        };
        await newCard.save();
        return newCard;
    } catch (err) {
        throw new Error(err.message);
    };
};

/* ----- GET my-cards request ----- */
const getUserCards = async (userId) => {
    try {
        const myCards = await Card.find({ userId: userId });
        if (myCards.length === 0) {
            throw new Error("You have no cards yet");
        };
        return myCards;
    } catch (err) {
        throw new Error(err.message);
    }
};

/* ----- GET card by Id request ----- */
const getCardById = async (cardId) => {
    try {
        const card = await Card.findById(cardId);
        if (!card) {
            throw new Error("Card Was Not Found");
        };
        return card;
    } catch (err) {
        throw new Error(err.message);
    };
};


/* ----- PUT card by Id request ----- */
const updateCard = async (cardId, cardData) => {
    try {
        const card = await Card.findByIdAndUpdate(cardId, cardData, { new: true });
        //the new: true option to return the updated document.
        if (!card) {
            throw new Error("Card Was Not Found");
        };
        return card;
    } catch (err) {
        throw new Error(err.message);
    };
};

/* ----- DELETE card by Id request ----- */
const deleteCard = async (cardId) => {
    try {
        const card = await Card.findByIdAndDelete(cardId);
        if (!card) {
            throw new Error("Card Was Not Found");
        };
        return card;
    } catch (err) {
        throw new Error(err.message);
    };
};

/* ----- PATCH request to like/unlike a card ----- */
const toggleCardLike = async (cardId, userId) => {
    try {
        const card = await Card.findById(cardId);
        if (!card) {
            throw new Error("Card Was Not Found");
        };
        if (card.likes.includes(userId)) {
            card.likes = card.likes.filter(id => id.toString() !== userId);
        } else {
            card.likes.push(userId)
        };
        await card.save();
        return card;
    } catch (err) {
        throw new Error(err.message);
    };
};

export { createNewCard, getCardById, updateCard, deleteCard, getUserCards, toggleCardLike };