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
  async function onclick(geo) {
    console.log(geo);
    console.log(geo.properties.NAME_2);
    updateLocation(geo.properties.NAME_2);
    // openModal()
    returnPoliceForce(geo.properties.NAME_2)
    try {
      const response = await fetch(`https://data.police.uk/api/forces/${geo.properties.NAME_2.toLowerCase().split(' ').join('-')}`)
    const data = await response.json()
    // console.log(data)
    setPoliceInfo(data)
    } catch (error) {
      // setPoliceInfo(error.msg)
      console.log(error)
    }
    
  }

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [location, updateLocation] = useState("");
  const [policedata, setPoliceData] = useState([])
  const [policeInfo, setPoliceInfo] = useState({})

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
        <p>{policeInfo.name}</p></Modal>

      <ComposableMap projection="geoMercator">
        <ZoomableGroup center={[-3, 55]} zoom={10}>
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
                      strokeWidth: "0.1px"
                    },
                    hover: {
                      fill: "#F53",
                    },
                    pressed: {
                      fill: "#E42",
                      stroke: "red",
                      strokeWidth: "0.1px"
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
          <Marker coordinates={[-3, 55]}>
            <circle r={2} fill="rgba(245, 40, 145, 0.8)" />
          </Marker>
          <Marker coordinates={[-0.5, 52]}>
            <circle r={2} fill="rgba(245, 40, 145, 0.8)" />
          </Marker>
        </ZoomableGroup>
      </ComposableMap>
    </div>
    <div>
      <h5>Info</h5>
      <p key={'loc'}>{location}</p>
      {/* <p>{selectedCounty}</p> */}
      <div className="description">
      {/* {policeInfo.description} */}
      {policeInfo.url}
      </div>
    </div>
    </>
  );
};

export default MapChart;
