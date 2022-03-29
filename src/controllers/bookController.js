const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const mongoose = require("mongoose")
const reviewModel = require("../models/reviewModel")
const { reviewer } = require("./reviewController")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidObjectId = function (userId) {
    return mongoose.Types.ObjectId.isValid(userId)
}

const createBook = async function (req, res) {
    try {
        data = req.body

        if (Object.keys(data).length > 0) {
            const { title, excerpt, userId, ISBN, category, subCategory } = data

            if (!isValid(title)) {
                return res.status(400).send({ status: false, msg: 'title is not valid' })
            }

            if (!isValid(excerpt)) {
                return res.status(400).send({ status: false, msg: 'excerpt is not valid' })
            }

            if (!isValid(userId)) {
                return res.status(400).send({ status: false, msg: 'user id is not valid' })
            }
// checking wether it is a valid user id
            if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, msg: " userId is not in valid format" })
            }
//check whether userId exist or not
            const isUserId = await userModel.findOne({ _id: userId })

            if (!isUserId) {
                return res.status(400).send({ status: false, msg: "user id is not in our system" })
            }


            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, msg: 'ISBN is not valid' })
            }

            if (!isValid(category)) {
                return res.status(400).send({ status: false, msg: 'category is missing' })
            }

            if (!isValid(subCategory)) {
                return res.status(400).send({ status: false, msg: 'sub Category is missing' })
            }

            if(!isValid(reviews)){
                return res.status(400).send({status:false, msg : 'reviews is missing'})
            }

            const bookCreated = await bookModel.create(data)
           
            return res.status(201).send({ status: true, msg: "Created", data: bookCreated })





        } else {
            return res.status(400).send({ status: false, msg: "body is missing" })
        }

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}





const getBooks = async function (req, res) {

    const filter = {}
    filter.isDeleted = false


    if (Object.keys(data).length > 0) {
        const { userId, category, subCategory } = req.query

        if (isValid(userId) && isValidObjectId(userId)) {

            filter.userId = userId
        }

        if (isValid(category)) {

            filter.category = category.trim()
        }

        if (isValid(subCategory)) {
            filter.subCategory = subCategory.trim()

        }

    }
    const bookList = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, category: 1,userId : 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })

    if (bookList.length == 0) {
        return res.status(400).send({ status: false, msg: " not found, change your filter value" })
    }

    return res.status(200).send({ status: true, msg: "Books List", data: bookList })

}



const getBookDetailsById = async function (req, res) {
    try {
        data = req.params.bookId

        if (!isValid(data)) {
            return res.status(400).send({ status: false, msg: "param is missing" })
        }

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, msg: "param is not in valid format" })
        }

        bookDetails = await bookModel.findOne({ _id: data, isDeleted: false })
        
        if (!bookDetails) {
            return res.status(400).send({ status: false, msg: "books already deleted or not found" })
        }

        const reviewer = await reviewModel.find({ bookId: data, isDeleted: false })

        const datas  = bookDetails
        datas._doc.reviewsData = reviewer

        // bookDetails.reviewsData = reviewer

        // console.log(bookDetails)
        return res.status(200).send({ status: true, msg: "done", data: datas._doc })





    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


const updateBooks = async function (req, res) {
    try {
        data = req.body
        bookId = req.params.bookId

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "book Id is  missing" })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "book id is not valid" })
        }

        const isBookexist = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!isBookexist) {
            return res.status(400).send({ status: false, msg: "no book exist with this id" })
        }

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "body is missing" })
        }

        let obj = {}


        const { title, excerpt, releasedAt, ISBN } = data

        if (title) {
            if (!isValid(title)) {
                return res.status.send({ status: false, msg: "title is missing " })
            }
            const titleIsUnique = await bookModel.find({ title: title }) 
            if (titleIsUnique.length > 0) {
                return res.status(400).send({ status: false, msg: "title is already present in dataBase" })
            }

            obj.title = title


        }

        if (excerpt) {
            if (!isValid(excerpt)) {
                return res.status.send({ status: false, msg: "excerpt is not valid" })
            }
            obj.excerpt = excerpt
        }

        if (releasedAt) {
            if (!isValid) {
                return res.status(400).send({ status: false, msg: "released at is not valid" })
            }
            obj.releasedAt = releasedAt
        }

        if (ISBN) {
            if (!isValid(ISBN)) {
                return res.status(400).send({ status: false, msg: "ISBN is not valid" })
            }

            ISBNIsUnique = await bookModel.find({ ISBN: ISBN })
            if (ISBNIsUnique.length > 0) {
                return res.status(400).send({ status: false, msg: "ISBN is already in Database" })
            }

            obj.ISBN = ISBN
        }

        const updatingBook = await bookModel.findOneAndUpdate(
            { _id: bookId },
            { $set: obj },
            { new: true }

        )
        return res.status(200).send({ status: true, msg: "Updated", data: updatingBook })





    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}





const deleteBooks = async function (req, res) {
    try {

        bookId = req.params.bookId
        console.log(bookId)

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "book id is not valid" })
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, msg: "Book id is not in valid format" })
        }

        BookIdExist = await bookModel.findById({ _id: bookId })
        if (!BookIdExist) {
            return res.status(404).send({ status: false, msg: "id does not exist" })
        }

        if (BookIdExist.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "book is already deleted" })
        }
//updating to isdeleted
        const IsDeleted = await bookModel.findOneAndUpdate(
            { _id: bookId },
            { $set: { isDeleted: true } }
        )

        return res.status(200).send({ status: true, msg: "Updated", data : IsDeleted })


    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}











module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBookDetailsById = getBookDetailsById
module.exports.updateBooks = updateBooks
module.exports.deleteBooks=deleteBooks
