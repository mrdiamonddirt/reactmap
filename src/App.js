import React from "react";
import ReactTooltip from "react-tooltip";
import "./App.css";
import { useState, useEffect } from "react";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import Modal from "react-modal";

const markers = [
  {
    markerOffset: -15,
    name: "United Kingdom",
    markerOffset: '-45px',
    coordinates: [-10.1193, 51.4897]
  },
  { markerOffset: 15, name: "London", fontSize:'1px', coordinates: [-0.118092, 51.509865] },
  { markerOffset: -25, name: "York", fontSize:'1px', coordinates: [-1.080278, 	53.958332] },
  { markerOffset: 10, name: "Lancaster", fontSize:'1px', coordinates: [-2.801000, 54.047001] },
  { markerOffset: 15, name: "Edinburgh", fontSize:'1px', coordinates: [-3.188267, 55.953251] }
];

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-kingdom/uk-counties.json";

const MapChart = () => {
  const [crimenum, setcrimenum] = useState('')

  async function onclick(geo) {
    console.log(geo);
    // console.log(geo.properties.NAME_2);
    updateLocation(geo.properties.NAME_2);
    updateCountry(geo.properties.NAME_1);
    // console.log(geo.properties.NAME_0);
    updateType(geo.properties.TYPE_2)
    console.log(geo.properties.NAME_1);
    // console.log(geo.properties.TYPE_2);
    // openModal()
    returnPoliceForce(geo.properties.NAME_2)
    try {
      const response = await fetch(`https://data.police.uk/api/forces/${geo.properties.NAME_2.toLowerCase().split(' ').join('-')}`)
    const data = await response.json()

    const response2 = await fetch(`https://data.police.uk/api/crimes-no-location?category=all-crime&force=${geo.properties.NAME_2.toLowerCase().split(' ').join('-')}&date=2022-08`)
    const data2 = await response2.json()
    // console.log(`data2 `, data2)
    let crimesreported = data2.length
    console.log(crimesreported)
    setcrimenum(crimesreported)

    console.log(data)
    for (let j=0; j< data.engagement_methods.length; j++)
    {
      setengagementMethods(data.engagement_methods.url + data.engagement_methods[j].url)
      console.log(engagementMethods)
    }
    setPoliceInfo(data)
    } catch (error) {
      setPoliceInfo('no data')
      console.log(error)
    }
  }
  const [position, setPosition] = useState({ coordinates: [-3, 55], zoom: 8 });
  function handleZoomIn() {
    if (position.zoom >= 60) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 4 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 20) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom - 2 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [location, updateLocation] = useState("");
  const [country, updateCountry] = useState("");
  const [type, updateType] = useState("");
  const [policedata, setPoliceData] = useState([])
  const [policeInfo, setPoliceInfo] = useState({})
  const [engagementMethods, setengagementMethods] = useState({})

  function openModal() {
    setIsOpen(true);
  }

 const [selectedCounty, updateCounty] = useState("")
 
  function returnPoliceForce(currentloc) {
    let locationLC = currentloc.toLowerCase();
    for (let i = 0; i <  policedata.length; i++) {
      // console.log(policedata[i])
      if (locationLC === policedata[i].id) {
        console.log('match')
        console.log(`returned ${locationLC}`)
        console.log(`returned police data id = ${policedata[i].id}`)
        console.log(`returned police data id = ${policedata[i].name}`)
        updateCounty(policedata[i].name)
        console.log(`Selected County ${selectedCounty}`)
        return
      } else {
        console.log('no match')
        console.log(`returned ${locationLC}`)
        console.log(`returned police data id = ${policedata[i].id}`)
        updateCounty("unable to find")
      }
      
    }
    
  }
  // function afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }

  function closeModal() {
    setIsOpen(false);
  }

  function name(params) {
    
  }

  useEffect(() => {
    const fetchPoliceData = async () => {
      try {
        const response = await fetch(
          'https://data.police.uk/api/forces'
        )
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        const data = await response.json();
        setPoliceData(data)
        console.log(policedata)
      } catch (err) {
        setPoliceData('Could not fetch data')
        console.log(err.message)
      }
    }
    fetchPoliceData()
  }, [])
 

  return (
    <>
    <div>
      <button className="infoBtn" onClick={openModal}>Info</button>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal">
        <h2 className="modelheader" >County Info</h2>
        <p key="modalloc" className={'modalloc'}>{location}</p>
        <p>{policeInfo.url}</p>
        <p>{policeInfo.name}</p>
        {/* turnery operator V V */}
        {crimenum === 0 ? <p>not on file</p>:<p>Crimes Reported = {crimenum}</p>}
        </Modal>
        <div className="mapContainer">
      <ComposableMap projection="geoMercator" projectionConfig={{
        // rotate: [58, 20, 0],
        scale: 2000
      }}>
        <ZoomableGroup center={position.coordinates} zoom={position.zoom} onMoveEnd={handleMoveEnd}>
          <Geographies geography={geoUrl} fill="rgba(0, 139, 1, 1)">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: "green",
                      stroke: "black",
                      strokeWidth: "0.5px",
                      outline: "none",
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none"

                    },
                    pressed: {
                      fill: "black",
                      stroke: "red",
                      strokeWidth: "0.5px",
                      outline: "none"

                    },
                  }}
                  onMouseEnter={() => {
                  }}
                  onMouseLeave={() => {
                  }}
                  onClick={() => onclick(geo)}
                  fill="orange"
                  // stroke="black"
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, markerOffset }) => (
        <Marker key={name} coordinates={coordinates}>
          <g
            fill="none"
            stroke="#FF5533"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(-12, -24)"
          >
            <circle cx="12" cy="10" r="3" />
            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
          </g>
          <text 
            textAnchor="middle"
            y={markerOffset}
            style={{fontFamily: "system-ui", fill: "#5D5A6D", pointerEvents: 'none'}}
          >
            {name}
          </text>
        </Marker> ))}
        </ZoomableGroup>
      </ComposableMap>
      </div>
    </div>
    <div className="infoTab">
      <h5>Info</h5>
      <h6>Country: {country}</h6>
      <h6 key={'loc'}>County: {location}</h6>
      <h6>Country: {selectedCounty}</h6>
      <div className="description">
      {policeInfo === 'no data' ? <div>force not found</div>:<div>{policeInfo.description}</div>}
      {/* {policeInfo.description} */}
      {/* {policeInfo.url} */}
      </div>
    </div>
    <div className="controls">
        <button onClick={handleZoomIn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button onClick={handleZoomOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default MapChart;
