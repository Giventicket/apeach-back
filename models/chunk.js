/** 
 *  @swagger 
 *    components:
 *      schemas:
 *        User: 
 *          type: object
 *          required:
 *            - name
 *            - email
 *          properties
 *            name:
 *              type: string
 *            email:
 *              type: string
 *              format: email
 *              description: Email for the user
 *            examples:
 *              name: joohee
 *              email: joohee@email.com
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;
const chunkSchema = new Schema({
    status: {
        type: String, // 0 : source_wave, 1 : source_text, 2 : target_text, 3 : target_wave
        default: "0",
    }, 
    source_wave_url: {
        type: String,
        required: true
    }, 
    source_text: {
        type: String,
        default: ""
    }, 
    target_text: {
        type: String,
        default: ""
    }, 
    target_wave_url: {
        type: String,
        default: ""
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chunk', chunkSchema);