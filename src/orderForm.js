import React, { PureComponent } from 'react';
import assign from 'object-assign';

class OrderForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      form: {
        number: 1,
      },
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('form', this.state.form);
  }

  handleChange(e) {
    e.preventDefault();
    if(e.target && e.target.name) {
      this.setState({
        form: assign({}, this.state.form, {
          [e.target.name]: e.target.value,
        }),
      });
    }
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({
      showForm: !this.state.showForm,
    })
  }

  render() {
    const { showForm } = this.state;

    return (
      <div className="bestel-knop">
        {showForm && <div className="bestel-formulier-container" style={{
          top: document.body.scrollTop,
        }}>
          <div className="bestel-formulier">
            <p>Bestellen...</p>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <label>
                  <div>Naam</div>
                  <input type="text" autoFocus required name="name" placeholder="Naam" onChange={this.handleChange} />
                </label>
              </div>
              <div className="row">
                <label>
                  <div>E-mailadres</div>
                  <input type="email" required name="email" placeholder="E-mailadres" onChange={this.handleChange} />
                </label>
              </div>
              <div className="row">
                <label>
                  <div>Aantal</div>
                  <input type="number" min="0" required  name="number" placeholder="Aantal" value={this.state.form.number} onChange={this.handleChange} />
                </label>
              </div>
              <div className="row">
                <label>
                  <div>Prijs (exclusief verzendkosten)</div>
                  <input name="total" readOnly value={`€ ${this.state.form.number ? this.state.form.number * 18 : 0}`} />
                </label>
              </div>
              <div>
                <button type="submit">Bestellen</button>
                <button onClick={this.handleClick}>Annuleren</button>
              </div>
            </form>
          </div>
        </div>}
        <button onClick={this.handleClick}>Bestellen</button>
      </div>
    );
  }
}

export default OrderForm;
