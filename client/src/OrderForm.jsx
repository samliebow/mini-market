import React from 'react';
import PropTypes from 'prop-types';

class OrderForm extends React.Component {
  constructor(props) {
    super(props);
    const lowestPrice = this.getLowestPrice();
    // slice to convert from 0-based to 1-based numbering
    this.quantityOptions = this.makeQuantityOptions().slice(1);

    this.state = {
      singlePrice: lowestPrice,
      // toFixed solves floating point issue; it returns a string, but that's not a problem here.
      totalPrice: lowestPrice.toFixed(2),
      quantity: 1,
      dimensionZeroVariant: '',
      dimensionOneVariant: '',
      pleaseSelectShownZero: false, // e.g. "Please select a size"
      pleaseSelectShownOne: false,
    };

    this.handleOptionSelect = this.handleOptionSelect.bind(this);
    this.handleQuantitySelect = this.handleQuantitySelect.bind(this);
    this.handleBuyNowClick = this.handleBuyNowClick.bind(this);
  }

  getLowestPrice(variantsArray = this.props.data.variants.allVariants) {
    // each variant is a dim-1-option, dim-2-option, price, quantity tuple
    const prices = variantsArray.map(variant => variant[2]);
    return Math.min(...prices);
  }

  getMatchingVariants(optionName, dimensionNum) {
    const optionMatches = this.props.data.variants.allVariants
      .filter(variant => variant[dimensionNum] === optionName);

    const otherVariantName = dimensionNum === 0 ?
      this.state.dimensionOneVariant : this.state.dimensionZeroVariant;
    const otherVariantSet = !!otherVariantName; // true if not empty

    if (otherVariantSet) {
      return optionMatches
        .filter(variant => variant[+!dimensionNum] === otherVariantName); // +! is 0 if 1, 1 if 0
    }
    return optionMatches;
  }

  handleOptionSelect(event, dimensionNum) {
    const optionName = event.target.value;
    let matchingVariants;
    const otherVariantName = dimensionNum === 0 ?
      this.state.dimensionOneVariant : this.state.dimensionZeroVariant;
    const otherVariantSet = !!otherVariantName;
    if (!optionName && !otherVariantSet) {
      matchingVariants = this.props.data.variants.allVariants;
    } else if (!optionName) {
      matchingVariants = this.getMatchingVariants(otherVariantName, +!dimensionNum);
    } else {
      matchingVariants = this.getMatchingVariants(optionName, dimensionNum);
    }
    const price = this.getLowestPrice(matchingVariants);
    if (dimensionNum === 0) {
      this.setState({
        dimensionZeroVariant: optionName,
        singlePrice: price,
        totalPrice: (price * this.state.quantity).toFixed(2),
        pleaseSelectShownZero: false,
      });
    } else {
      this.setState({
        dimensionOneVariant: optionName,
        singlePrice: price,
        totalPrice: (price * this.state.quantity).toFixed(2),
        pleaseSelectShownOne: false,
      });
    }
  }

  handleQuantitySelect(event) {
    const quantity = +event.target.value;
    this.setState({
      quantity,
      totalPrice: (this.state.singlePrice * quantity).toFixed(2),
    });
  }

  handleBuyNowClick(event) {
    if (!this.state.dimensionZeroVariant) {
      this.setState({ pleaseSelectShownZero: true });
    }
    if (!this.state.dimensionOneVariant) {
      this.setState({ pleaseSelectShownOne: true });
    }
    // More stuff will go here when I add modals
  }

  makeQuantityOptions() {
    return Array(this.props.data.quantity + 1).fill(null) // Array of nulls of length quantity + 1
      .map((nada, index) => (
        <option className="quantity" key={index} value={index}>
          {index}
        </option>));
  }

  renderOption(optionName, dimensionNum) {
    const matchingVariants = this.getMatchingVariants(optionName, dimensionNum);
    let price;
    if (matchingVariants.length === 1) {
      price = matchingVariants[0][2].toFixed(2);
    } else {
      const prices = matchingVariants.map(variant => variant[2]);
      price = `${Math.min(...prices).toFixed(2)}-${Math.max(...prices).toFixed(2)}`;
    }
    return (
      <option className="variant-option" key={optionName} value={optionName}>
        {`${optionName} ($${price})`}
      </option>
    );
  }

  renderPleaseSelect(dimension, dimensionNum) {
    const test = dimensionNum === 0 ?
      this.state.pleaseSelectShownZero :
      this.state.pleaseSelectShownOne;
    return test ?
      <div className="please-select">
        Please select a {dimension.toLowerCase()}
      </div> :
      null;
  }

  render() {
    return (
      <div className="main-item" id="order-form">
        <h4 id="title">{this.props.data.title}</h4>

        <div id="price-and-question">
          <span id="price">${this.state.totalPrice}</span>
          <span id="q-span"><button id="q-button">Ask a question</button></span>
        </div>

        <div id="variants">
          {this.props.data.variants.dimensions.map((dimension, dimensionNum) => (
            <div key={dimension.name} className="variant-dimension">
              <div className="variant-dimension-name">{dimension.name}</div>
              <select
                value={dimensionNum ? this.state.dimensionOneVariant : this.state.dimensionZeroVariant}
                onChange={event => this.handleOptionSelect(event, dimensionNum)}
              >
                <option className="variant-option" key={`noChoice${dimensionNum}`} value="">
                  Please select an option...
                </option>
                {dimension.options.map(optionName => this.renderOption(optionName, dimensionNum))}
              </select>
              {this.renderPleaseSelect(dimension.name, dimensionNum)}
            </div>))}

        </div>

        <div id="quantity">
          <div>Quantity</div>
          <select onChange={this.handleQuantitySelect}>
            {this.quantityOptions}
          </select>
        </div>

        <div id="buy-now">
          <button onClick={this.handleBuyNowClick}>
          Buy it now {'>'} {/* Render the character > without offending JSX */}
          </button>
        </div>

        <div id="add-cart">
          <button>
          Add to cart
          </button>
        </div>

      </div>
    );
  }
}

OrderForm.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    sellerName: PropTypes.string.isRequired,
    contactName: PropTypes.string.isRequired,
    variants: PropTypes.shape({
      dimensions: PropTypes.arrayOf(PropTypes.object),
      allVariants: PropTypes.arrayOf(PropTypes.array),
    }),
    quantity: PropTypes.number,
    // numInCarts: PropTypes.number,
  }).isRequired,
};

export default OrderForm;


/* Not implementing now, but leaving as notes for a stretch goal:

renderSpecialMessage() {
  const specialMessage = 'others want'; // Hard-coding for now
  if (specialMessage === 'others want') {
    return (
      <div>
        <span>((Image will go here, real thing is vector graphics in <g> tag)) </span>
        <span>
          <b>Other people want this. </b>
          {this.props.data.numInCarts} people have this in their carts right now.
        </span>
      </div>
    );
  }
  return null;
}

*/
