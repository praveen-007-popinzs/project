const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const createReview = new mongoose.Schema({
    bookId : {
        type : objectId,
        required:true,
        ref: "book"
    },
    reviewedBy :{
        type : String,
    
        default : "Guest",

    },
    reviewedAt : {
        type : Date,
        
    },

    rating : {
        type : Number,
        required: true,
        minlength:[1, "minimum rating should be 1"],
        maxLength : [5, "maximum rating should not be greater than 5"]

    },
    review: {
        type: String
    },
    isDeleted : {
        type : Boolean,
        default:false
    }

})


module.exports= mongoose.model('review', createReview)