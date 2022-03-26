const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default:true
    },
    isAdmin:{
        type: Boolean, 
        default:false
    },

    userImage: {
        type: String,
       
        default:''
      },

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "People");
module.exports = User;
