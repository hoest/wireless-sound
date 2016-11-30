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
      scrollTop: document.body.scrollTop
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
          <div className="bestel-formulier">
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
                title="Prijs (exclusief verzendkosten)"
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
