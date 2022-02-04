import logo from "./logo.svg";
import "./App.css";
import bgImg from "./images/pattern-bg.png";
import react, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import icon from "./images/icon-location.svg";
import L from "leaflet";
import ReactDOM from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";

function App() {
  const [Ip, setIp] = useState("192.212.174.101");
  const [Data, setData] = useState({});
  const [Coords, setCoords] = useState([37.8025, 122.271]);
  let icon = L.icon({
    iconRetinaUrl: require("./images/icon-location.png"),
    iconUrl: require("./images/icon-location.svg"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
  const iconMarkup = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" width="46" height="56">
      <path
        fill-rule="evenodd"
        d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"
      />
    </svg>
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });
  useEffect(() => {
    axios
      .get(
        `http://ip-api.com/json/${Ip}?fields=status,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,isp,query`
      )
      .then((res) => {
        const ipInfo = res.data;

        setData(ipInfo);
        console.log(ipInfo);
        setCoords([ipInfo.lat, ipInfo.lon]);
      });
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .get(
        `http://ip-api.com/json/${Ip}?fields=status,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,isp,query`
      )
      .then((res) => {
        const ipInfo = res.data;
        setData(ipInfo);
        console.log(ipInfo);
        setCoords([ipInfo.lat, ipInfo.lon]);
      });
  };
  function secondsToHms(d) {
    let dh, type;
    if (d < 0) {
      dh = -1 * d;
      type = "-";
    } else {
      dh = d;
      type = "+";
    }
    var h = Math.floor(dh / 3600);
    var m = Math.floor((dh % 3600) / 60);

    console.log(h, m);

    return "UTC " + type + h + ":" + m;
  }
  function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());

    return null;
  }
  return (
    <div className="app">
      <div className="foreground">
        <div className="info-container">
          <div>
            <header className="app-header">IP Address Tracker</header>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search for any IP address or Domain"
              onChange={(e) => setIp(e.target.value)}
            />
            <button onClick={handleSubmit}>.</button>
          </div>

          <div className="card">
            <div className="ip-address-container">
              <p>IP ADDRESS</p>
              <div>{Data.query}</div>
            </div>
            <div className="location-container">
              <p>LOCATION</p>
              <div>
                {Data.regionName}, {Data.region}, {Data.zip}
              </div>
            </div>
            <div className="timezone-conatiner">
              <p>TIME ZONE</p>
              <div>{secondsToHms(Data.offset)}</div>
            </div>
            <div className="isp-container">
              <p>ISP</p>
              <div>{Data.isp}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="background">
        <div alt="" />
        <MapContainer
          center={Coords}
          zoom={15}
          scrollWheelZoom={false}
          id="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={Coords} icon={customMarkerIcon}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <ChangeMapView coords={Coords} />
          <ZoomControl position="bottomleft" />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
