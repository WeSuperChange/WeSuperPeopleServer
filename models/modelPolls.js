// poll model

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Enkelkinder
const pollAnswerSchema = new mongoose.Schema(
    {
        "AnswerText": {
            type: String,
            required: true
        },
        "AnswerCount": {
            type: Number,
            default: 0,
            required: true
        },
        "nextPollId": {
            type: String
        }
    }
);

// Kinder
const pollSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: uuidv4(),
            required: false
        },
        Category: {
            type: String,
            required: true
        },
        Question: {
            type: String,
            required: true
        },
        PollAnswers: [{
            type: pollAnswerSchema,
            required: true
        }],
        nextPollId: {
            type: String,
            required: false
        },
    }
);

// Eltern
const pollCollectionSchema = new mongoose.Schema(
    {
        // owner id (google id)
        UID: {
            type: String,
            required: true
        },
        // Array of subdocuments
        Polls: [pollSchema],

        // Single nested subdocuments. Caveat: single nested subdocs only work
        // in mongoose >= 4.2.0
        // Poll: pollSchema
    }, { timestamps: true }
);

const PollGroup = mongoose.model('Polls', pollCollectionSchema);

module.exports = PollGroup;
