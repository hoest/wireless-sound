import React, { PureComponent, Children, cloneElement } from 'react';
import assign from 'object-assign';

class Form extends PureComponent {
  /**
   */
  constructor(props) {
    super(props);
    this.state = {};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   */
  componentWillMount() {
    Children.map(this.props.children, (child, idx) => {
      const { name, defaultValue } = child.props;

      this.setState({
        [name]: defaultValue || '',
      });
    });
  }

  /**
   */
  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state);
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
  getValue(name) {
    switch (name) {
      case 'total': {
        const price = this.state.number
          ? this.state.number * 18
          : 0;

        return `€ ${Number(price).toFixed(2)}`
      }
      default:
        return this.state[name];
    }
  }

  /**
   * Render method
   */
  render() {
    const { children, toggleForm } = this.props;

    return <form onSubmit={this.handleSubmit}>
      {Children.map(children, (child, idx) => {
        const { title, name } = child.props;

        return <div key={idx} className={`row ${name}`}>
          <label>
            <div className="label">{title}</div>
            {cloneElement(child, assign({}, child.props, {
              onChange: this.handleChange,
              value: this.getValue(name),
              defaultValue: undefined,
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
