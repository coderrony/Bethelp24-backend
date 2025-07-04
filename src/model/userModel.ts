
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    playerEvent: {
      type: ObjectId,
      ref: 'PlayerEventModel',
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      unique: true,
    },
    email: {
      type: String,
      require:false
    },
    profileImage: {
      type: String,
      default: () => process.env.DEFAULT_IMAGE,
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      maxlength: [128, 'Password must be less than 128 characters long'],
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error:any) {
    next(error);
  }
});

const UserModel =
  mongoose.models.UserModel || mongoose.model('UserModel', userSchema);

export default UserModel;
