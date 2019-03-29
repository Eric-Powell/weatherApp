import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      zip: 10036,
      isZipAllNumbers: true,
      isFiveNumbers: true,
      isZipValid: true,
      city: '',
      description: '',
      icon: '',
      tempF: null,
      temp_minF: null,
      temp_maxF: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (!isNaN(Number(event.target.value)) && event.target.value.length === 5) {
      this.setState({
        zip: event.target.value, 
        isZipAllNumbers: true
      });
    } else {
      this.setState({
        zip: event.target.value, 
        isZipAllNumbers: false
      });
    }
  }

  handleSubmit(event) {
    if (!this.state.isZipAllNumbers) {
      this.setState({isFiveNumbers: false})
    } else {
      this.componentDidMount(this.state.zip);
    }
    event.preventDefault();
  }

  componentDidMount(zip) {
    zip = this.state.zip;
    let url = new URL('https://api.openweathermap.org/data/2.5/weather');
    let params = {zip:zip, appid:'709847967f5e54b97308c1b2cae4dee5'};
    url.search = new URLSearchParams(params);
    
    let handleErrors = (response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    };

    let getIcon = (id) => `http://openweathermap.org/img/w/${id}.png`;

    let titleCase = (str) => {
      return str.split(' ')
        .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    };

    fetch(url)
      .then(handleErrors)
      .then(res => res.json())
      .then((res) => {
        this.setState({
          isLoaded: true,
          isZipValid: true,
          isFiveNumbers: true,
          city: res.name,
          description: titleCase(res.weather[0].description),
          icon: getIcon(res.weather[0].icon),
          tempF: Math.round(res.main.temp * 9/5 - 459.67),
          temp_minF: Math.round(res.main.temp_min * 9/5 - 459.67),
          temp_maxF: Math.round(res.main.temp_max * 9/5 - 459.67)
        });
      })
      .catch(error => {
        this.setState({
          error: error,
          isZipValid: false,
        });
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="city">
            {this.state.city}
          </div>
            <img className="icon" src={this.state.icon} alt=""/>
        </header>

        <div className="description">
          {this.state.description}
        </div>
        <div className="temp">
          {this.state.tempF}˚
        </div>
        <div className="min-max-container"> 
          <div className="min-temp">
            {this.state.temp_minF}˚
          </div>
          <div className="max-temp">
            {this.state.temp_maxF}˚
          </div>
        </div>
       
        <hr className="line"></hr>

        <div className="errors">
          {!this.state.isFiveNumbers && (
            <div>You entered {this.state.zip}, please enter a 5 digit number and try again</div>
          )}
          {!this.state.isZipValid && (
            <div>You entered {this.state.zip}, which is not found in our database. Please enter a valid 5 digit zip code and try again</div>
          )}
        </div>

        <form onSubmit={this.handleSubmit}>
          <label>
            <div className="zip">Zip Code:</div>
            {/* Zip Code: */}
            <input className="text" type="text" value={this.state.zip} onChange={this.handleChange} />
          </label>
          <input className="submit" type="submit" value="Update" />
        </form>

      </div>
    );
  }
}

export default App;
