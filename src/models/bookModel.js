const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title :{
        type: String,
        required : [true, "book title is required"],
        unique: true
    },
    excerpt:{
        type:String,
        required:[true, "excerpt is missing"]
    },
    userId:{
        type:objectId,
        ref : "user",
        required : true

    },
    ISBN : {
        type : String,
        required:[true, "ISBN is required"],
        unique: true,
        match : [/\b(?:ISBN(?:: ?| ))?((?:97[89])?\d{9}[\dx])\b/, "pls provide valid ISBN number"]
    },
    category:{
        type:String,
        required:[true, "category is missing"],
    },
    subCategory : {
        type : String,
        required:[true, "subCategory is missing"]
    },
    reviews:{
        type : Number,
        default :0
       
       
    },
    deletedAt :{
        type:Date,
        default:null
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    releasedAt :{
        type:Date,
        required:[true, "releasedAt is missing"]
    }
}, {timestamps:true} )

module.exports=mongoose.model('book', bookSchema)