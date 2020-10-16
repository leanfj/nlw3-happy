import {Map, Popup} from 'react-leaflet';
import React, {useEffect, useState} from 'react';
import {FiPlus, FiArrowRight} from 'react-icons/fi';
import {Link} from 'react-router-dom'
import mapMarkerImg from '../images/map-marker.svg';
import '../styles/pages/orphanage-map.css';
import Leaflet from 'leaflet';
import {TileLayer, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

interface Orphanage {
  id: number
  latitude: number
  longitude: number
  name: string

}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([])
  const [currentPosition, setCurrentPosition] = useState({latitude: 0, longitude: 0})
  useEffect(() => {
    api.get('orphanages').then(response => setOrphanages(response.data))
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords
      setCurrentPosition({latitude, longitude})
    })
  }, [setCurrentPosition])

  return (

    <div id="page-map" className="animate__animated animate__fadeIn">
      <aside>
        <header>
          <Link to="/">
            <img src={mapMarkerImg} alt="Happy" />
          </Link>
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>
        <footer>
          <strong>Rio de Janeiro</strong>
          <span>RJ</span>
        </footer>
      </aside>
      <Map center={[currentPosition.latitude, currentPosition.longitude]} zoom={15} style={{width: '100%', height: '100%'}} >
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {orphanages.map((orphanage) => {
          return (
            <Marker position={[orphanage.latitude, orphanage.longitude]} icon={mapIcon} key={orphanage.id}>
              <Popup closeButton={false} maxWidth={240} minWidth={240} className="map-popup">
                {orphanage.name}
                <Link to={`/orphanages/${orphanage.id}`}><FiArrowRight /></Link>
              </Popup>
            </Marker>
          )
        })}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage" >
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  )
}

export default OrphanagesMap;
