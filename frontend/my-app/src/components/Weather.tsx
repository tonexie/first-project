import React, { Component } from 'react';
import { fetchGeolocation, fetchWeather } from '../api/ApiOpenWeather';
import { Modal, Button, Table } from 'react-bootstrap';
import { capitalize, startCase } from 'lodash';
import moment from 'moment';
import { start } from 'repl';


interface WeatherData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Weather[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    "3h": number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherComponentState {
  weatherData: {
    list: WeatherData[] | null;
  } | null;
  showModal: boolean;
  cityInput: string;
  cityName: string;
  error: string;
}

function formatTime(time: string) { //change from 24 hour to am/pm style
  return moment(time, 'HH:mm:ss').format('h:mm A');
}

export class WeatherComponent extends Component<{}, WeatherComponentState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      weatherData: null,
      showModal: false,
      cityInput: 'Auckland',
      cityName: 'Auckland',
      error: ''
    };
  }

  componentDidMount() {
    this.fetchWeatherData();
  }

  async fetchWeatherData() {
    try {
      const geolocation = await fetchGeolocation(this.state.cityInput); // api call to fetch lat and lon
      const cityName = startCase(this.state.cityInput); 
      try {
        const weatherData = await fetchWeather(geolocation.lat, geolocation.lon); // api call to fetch weather info
        this.setState({ weatherData, cityName, error: '' });
        return true;
      } catch (error) {
        console.error("Error fetching weather:", error);
        this.setState({ weatherData: null, cityName: '', error: 'Failed to fetch weather data.' });
        return false;
      }
    } catch (error) {
      console.error("Error fetching geolocation:", error);
      this.setState({ weatherData: null, cityName: '', error: 'Invalid city name' });
      return false;
    }
  }

  handleOpenModal = () => {
    this.setState({ showModal: true }); // when button is clicked, modal is true aka displayed
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ cityInput: event.target.value });
  }

  handleSubmit = async () => {
    const { cityInput } = this.state;
    if (cityInput.trim() === '') {
      this.setState({ error: 'Please enter a valid city name' });
    } else {
      const isSuccess = await this.fetchWeatherData();
      if (isSuccess) {
        this.setState({ showModal: false });
      }
    }
  }
  

  

  render() {
    const { 
      weatherData,
      showModal,
      cityInput,
      cityName,
      error,
    } = this.state;

    return (
      <div className="weather-component">
        <h1>{cityName} Weather Information</h1>
        <Button variant="primary" onClick={this.handleOpenModal}>Change City</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Temperature (°C)</th>
              <th>Feels Like (°C)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {weatherData && weatherData.list && weatherData.list.length > 0 ? (
              weatherData.list.map(data => (
                <tr key={data.dt}>
                  <td>{data.dt_txt.split(" ")[0]}</td>
                  <td>{formatTime(data.dt_txt.split(" ")[1])}</td>
                  <td>{(data.main.temp - 273.15).toFixed(1)}</td>
                  <td>{(data.main.feels_like - 273.15).toFixed(1)}</td>
                  <td>{data.weather[0].description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Loading weather data...</td>
              </tr>
            )}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={this.handleCloseModal} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title >Change City</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="text" value={cityInput} onChange={this.handleInputChange} />
            {error && <p className="error-message"  style={{color: 'red'}}>
              {error}
            </p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>Cancel</Button>
            <Button variant="primary" onClick={this.handleSubmit}>OK</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}