import React, {useState, useEffect, FormEvent, ChangeEvent} from "react";
import {Map, Marker, TileLayer} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet'
import {FiPlus} from "react-icons/fi";


import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapicon";
import api from "../services/api";
import {useHistory} from "react-router-dom";


export default function CreateOrphanage() {
  const history = useHistory()

  const [position, setPosition] = useState({latitude: 0, longitude: 0})

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpeningOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const [currentPosition, setCurrentPosition] = useState({latitude: 0, longitude: 0})

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords
      setCurrentPosition({latitude, longitude})
    })
  }, [setCurrentPosition])

  function handleMapClick(event: LeafletMouseEvent) {
    const {lat, lng} = event.latlng

    setPosition({
      latitude: lat,
      longitude: lng
    })

  }

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    const {latitude, longitude} = position
    const data = new FormData()

    data.append('name', name)
    data.append('about', about)
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))

    images.forEach(image => {
      data.append('images', image)
    })

    await api.post('orphanages', data)
    alert('Cadastro realizado com sucesso')

    history.push('/app')
  }
  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }

    const selectedImages = Array.from(event.target.files)

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview)
  }


  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={handleFormSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados de cadastro</legend>

            <Map
              center={[currentPosition.latitude, currentPosition.longitude]}
              style={{width: '100%', height: 280}}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer
                url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {position.latitude !== 0 ? (<Marker interactive={false} icon={mapIcon} position={[position.latitude, position.longitude]} />) : null}

            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" onChange={event => setName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} onChange={event => setAbout(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="image-container">
                {previewImages.map(image => {
                  return (
                    <img key={image} src={image} alt={name} />
                  )
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input multiple onChange={handleSelectImages} type="file" name="image[]" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" onChange={event => setInstructions(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento</label>
              <input id="opening_hours" onChange={event => setOpeningHours(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" className={open_on_weekends ? 'active' : ''} onClick={() => setOpeningOnWeekends(true)} >Sim</button>
                <button type="button" className={!open_on_weekends ? 'active' : ''} onClick={() => setOpeningOnWeekends(false)}>Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

