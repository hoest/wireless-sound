import Form from './form.jsx';
import React, { PureComponent } from 'react';
import { sendMail } from './api';

class OrderForm extends PureComponent {
  /**
   */
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      scrollTop: 0,
      height: 0,
    };

    this.toggleForm = this.toggleForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   */
  handleSubmit(form) {
    sendMail(form)
      .then(json => {
        this.setState({
          showForm: !json.success,
        });
      })
  }

  /**
   */
  toggleForm(e) {
    e.preventDefault();
    this.setState({
      showForm: !this.state.showForm,
    });
  }

  /**
   */
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  /**
   */
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  /**
   */
  handleScroll() {
    this.setState({
      scrollTop: document.body.scrollTop,
      height: window.innerHeight - (2 * 64),
    });
  }

  /**
   */
  render() {
    const { showForm } = this.state;

    return (
      <div className="bestel-knop">
        {showForm && <div className="bestel-formulier-container" style={{
          top: this.state.scrollTop,
        }}>
          <div className="bestel-formulier" style={{
            height: this.state.height,
          }}>
            <p>Bestellen...</p>
            <Form onSubmit={this.handleSubmit} toggleForm={this.toggleForm}>
              <input
                autoFocus
                name="name"
                required
                title="Naam"
                type="text"
              />
              <input
                name="email"
                required
                title="E-mailadres"
                type="email"
              />
              <input
                autoFocus
                name="address"
                required
                title="Adres"
                type="text"
              />
              <input
                autoFocus
                name="zipcode"
                required
                title="Postcode"
                type="text"
                maxLength="6"
              />
              <input
                autoFocus
                name="city"
                required
                title="Plaats"
                type="text"
              />
              <input
                defaultValue="1"
                min="0"
                name="number"
                required
                title="Aantal"
                type="number"
              />
              <input
                name="total"
                readOnly
                title="Prijs"
                type="text"
              />
            </Form>
          </div>
        </div>}
        <button onClick={this.toggleForm}>Bestellen</button>
      </div>
    );
  }
}

export default OrderForm;
