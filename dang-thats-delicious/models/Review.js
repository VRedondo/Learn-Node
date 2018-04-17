const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: 'You must supply a store'
  },
  text: {
    type: String,
    required: 'You must supply a text'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
});

function autoPopulateAuthor(next) {
  this.populate('author');
  next();
}

reviewSchema.pre('find', autoPopulateAuthor);
reviewSchema.pre('findOne', autoPopulateAuthor);

module.exports = mongoose.model('Review', reviewSchema);
