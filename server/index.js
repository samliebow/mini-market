const faker = require('faker');
const fRan = faker.random;
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: String,
  sellerName: String,
  contactName: String,
  variationTypes: Array,
  variations: Array,
  quantity: Number,
  materials: Array,
  isHandmade: Boolean,
  isProduct: Boolean,
  whenMade: String,
  numReviews: Number,
  numFavorites: Number,
  acceptGiftCards: Boolean,
  timeToShip: String,
  shipOrigin: String,
  acceptReturn: Boolean,
  acceptExchange: Boolean,
  acceptCancel: Boolean,
});

const Listing = mongoose.model('Listing', listingSchema);
const varTypes = ['Color', 'Flavor', 'Size', 'Style', 'Material', 'Scent'];
const whenMadeTypes = ['To order', 'Recently', '90s', '80s', '70s', '60s'];
const timeToShipTypes = ['1-3 days', '3-5 days', '1-2 weeks', '2-3 weeks'];
const shipOriginTypes = ['United States', 'United Kingdom', 'Canada'];
const randEl = array => array[Math.floor(Math.random() * array.length)];
const randVariations = (len) => {
  const variations = [];
  while (variations.length < len) {
    variations.push([fRan.word(), Number(`${Math.random() * 100}`.slice(0, 5))]);
  }
  return variations;
};
const randWordArray = (len) => {
  const els = [];
  while (els.length < len) {
    els.push(fRan.word());
  }
  return els;
};
const randInt = highest => 1 + Math.floor(Math.random() * highest);
const randBool = () => !Math.round(Math.random());

for (let i = 0; i < 3; i++) {
  const numVariationTypes = randInt(3);
  const fake = {
    title: faker.commerce.productName(),
    sellerName: fRan.word(),
    contactName: faker.name.firstName(),
    variationTypes: Array(numVariationTypes).fill(null).map(() => randEl(varTypes)),
    variations: Array(numVariationTypes).fill(null).map(() => randVariations(randInt(7))),
    quantity: randInt(25),
    materials: randWordArray(randInt(7)),
    isHandmade: randBool(),
    isProduct: randBool(),
    whenMade: randEl(whenMadeTypes),
    numReviews: randInt(500),
    numFavorites: randInt(500),
    acceptGiftCards: randBool(),
    timeToShip: randEl(timeToShipTypes),
    shipOrigin: randEl(shipOriginTypes),
    acceptReturn: randBool(),
    acceptExchange: randBool(),
    acceptCancel: randBool(),
  };
  console.log(fake);
}
