import cardSeed from "../../cards/initialData/initialCards.json" with {type: "json"};

import Card from "../../cards/models/Card.schema.js";

const seedCards = async () => {
    const cardsLength = await Card.countDocuments();

    if (cardsLength > 3) {
        return; // No further seeding if there are already 3 or more cards
    };

    // Fetch existing cards to check for duplicates
    const cardsFromDB = await Card.find();

    try {
        // Loop through each card in cardSeed
        for (const card of cardSeed) {
            // Check if a card with the same email already exists
            if (cardsFromDB.find((dbCard) => dbCard.email === card.email)) {
                continue; // Skip if a card with this email already exists
            };
            // Create and save the new card
            const newCard = new Card(card);
            await newCard.save();
        };
    } catch (error) {
        throw new Error(`Error seeding cards: ${error.message}`);
    };
};

export default seedCards;