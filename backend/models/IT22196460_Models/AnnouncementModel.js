const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({

    Announcement_ID : {
        type : String,
        required: true
    },
    Title : {
        type : String,
        required: true
    },
    Content : {
        type : Text,
        required: true
    },
    Category_ID : {
        type : String,
        required: true
    },
    Attachment_URL : {
        type : String,
        required: true
    },
    Create_At : {
        type : Date,
        required: true
    },
    Update_At : {
        type : Date,
        required: true
    },
    Published : {
        type : Boolean,
        required: true
    },
}, {timestamps:true});

const Announcement = mongoose.Model("Announcement",AnnouncementSchema);
export default Announcement;