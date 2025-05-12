const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { config } = require("../../config");

const collection = "users";

const objectSchema = {
    name: { 
        type: String, 
        required: [true, 'Nombre es requerido'],
        trim: true 
    },
    username: {
        type: String,
        required: [true, 'Nombre de usuario es requerido'],
        lowercase: true,
        trim: true,
        unique: true,
        minlength: [3, 'Username debe tener al menos 3 caracteres']
    },
    email: { 
        type: String, 
        required: [true, 'Email es requerido'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
    },
    password: { 
        type: String, 
        required: [true, 'Contraseña es requerida'],
        minlength: [6, 'Contraseña debe tener al menos 6 caracteres']
    },
    perms: { 
        type: [String], 
        default: ['updateEditor', 'DeleteEditor']
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
};

const options = {
  timestamps: true,
};

const schema = new mongoose.Schema(objectSchema, options);

schema.pre("updateOne", function (next) {
  const data = this.getUpdate()["$set"];

  bcrypt.hash(data.password, config.saltRounds, (err, hash) => {
    if (err) {
      return next(err);
    }
    data.password = hash;
    next();
  });
});

schema.pre("save", function (next) {
  const salt = bcrypt.genSaltSync(config.saltRounds);
  const passwordHash = bcrypt.hashSync(this.password, salt);

  this.password = passwordHash;
  next();
});

const User = mongoose.model(collection, schema);

module.exports = User;