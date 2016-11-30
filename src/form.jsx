import React, { PureComponent, Children, cloneElement } from 'react';
import assign from 'object-assign';

class Form extends PureComponent {
  /**
   */
  constructor(props) {
    super(props);
    this.state = {};

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   */
  handleChange(e) {
    if (e.target && e.target.name) {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({
        [name]: name === 'number' ? parseInt(value, 10) : value,
      });
    }
  }

  /**
   */
  getValue(name, defaultValue) {
    if (defaultValue && !this.state[name]) {
      this.setState({
        [name]: defaultValue,
      });
    }

    switch (name) {
      case 'total':
        return this.state.number
          ? this.state.number * 18
          : 0;
      default:
        return this.state[name] || defaultValue;
    }
  }

  /**
   * Render method
   */
  render() {
    const { children, onSubmit, toggleForm } = this.props;

    return <form onSubmit={onSubmit}>
      {Children.map(children, (child, idx) => {
        const { title, name, defaultValue } = child.props;

        return <div key={idx} className="row">
          <label>
            <div>{title}</div>
            {cloneElement(child, assign({}, child.props, {
              onChange: this.handleChange,
              value: this.getValue(name, defaultValue),
            }))}
          </label>
        </div>;
      })}

      <div>
        <button>Bestellen</button>
        <button onClick={toggleForm}>Annuleren</button>
      </div>
    </form>;
  }
}

export default Form;
