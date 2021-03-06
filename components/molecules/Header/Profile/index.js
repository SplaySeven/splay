import React, { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useDropzone } from "react-dropzone"
import Avatar from "../../../atoms/Avatar"
import { v4 as uuidv4 } from "uuid"
import firebase from "../../../../lib/firebase"
import { updatePhotoProfile, deletePhotoProfile } from "../../../../lib/db"
import Header02 from "./Header02"

const storage = firebase.storage()

export default function index({ userId, profile }) {
  const [loaddingForm, setLoaddingForm] = useState(true)
  const [uploadValue, setUploadValue] = useState(0)
  const [picureUrl, setPicureUrl] = useState(null)
  const [fileUpload, setFileUpload] = useState(null)
  const [pantallaModal, setPantallaModal] = useState(false)

  const Toggle = () => {
    setLoaddingForm(!loaddingForm)
  }

  // Photo portada
  const handleUpload = async (file) => {
    const extension = file.name.split(".").pop()
    const filename = `${uuidv4()}.${extension}`
    const storageRef = await storage.ref(`Portada/${filename}`)
    const task = storageRef.put(file)
    task.on(
      "state_changed",
      (snapshot) => {
        const percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadValue(percentage)
      },
      (error) => {
        console.log(error.message)
      },
      () => {
        storage
          .ref("Portada")
          .child(filename)
          .getDownloadURL()
          .then((url) => {
            setPicureUrl(url)
            updatePhotoProfile(userId[0].id, url)
            setLoaddingForm(!loaddingForm)
          })
        setUploadValue(100)
        setUploadValue(0)
        setFileUpload(null)
      }
    )
  }

  const handleDelete = () => {
    deletePhotoProfile(userId[0].id)
    setPantallaModal(false)
  }

  const Modal = () => {
    setLoaddingForm(true)
    setPantallaModal(true)
  }
  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0]
    setFileUpload({
      type: "image",
      file,
      preview: URL.createObjectURL(file),
    })
    handleUpload(file)
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    noKeyboard: true,
    multiple: false,
    onDrop,
  })

  return (
    <>
      <section
        className="mb-4"
        style={{background: '#fbf4f4', padding: '30px 15px 0px'}}
      >
        <div className="container mx-auto">
          <div className="coverContainer" style={{ position: "relative" }}>
              <img className="coverImage" src={userId[0].profilePhoto} alt="Imagen portada" />
              {profile === "W" ? (
                <button
                  onClick={Toggle}
                  className="changeCoverButton"
                >
                  Actualizar Portada
                  <img
                    src="/icons/icon8.png"
                    style={{
                      width: "35px",
                      display: "inline-block",
                      paddingLeft: "13px",
                    }}
                  />
                </button>
              ) : null}

              {!loaddingForm && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 3,
                    bottom: "-29px",
                    background: "#58595B",
                    color: "#fff",
                    padding: "4px 0px",
                    left: "30px",
                    borderRadius: "5px",
                    width: "300px",
                  }}
                >
                  <button
                    onClick={handleUpload}
                    {...getRootProps()}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      paddingLeft: "10px",
                    }}
                  >
                    <img
                      src="/icons/icon8.png"
                      style={{
                        width: "35px",
                        display: "inline-block",
                        paddingRight: "15px",
                      }}
                    />
                    <input {...getInputProps()} />
                    Subir Foto
                  </button>

                  <hr style={{ color: "white", padding: "0" }} />
                  <button
                    onClick={Modal}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      paddingLeft: "10px",
                      "&:hover": {
                        background: "#efefef",
                      },
                    }}
                  >
                    <img
                      src="/icons/icon8.png"
                      style={{
                        width: "35px",
                        display: "inline-block",
                        paddingRight: "15px",
                        button: "10px",
                      }}
                    />
                    Eliminar
                  </button>
                </div>
              )}
          </div>
          <div className="grid grid-cols-4 gap-4 profileOptions"></div>

          <Header02
            userId={userId[0].id}
            firstName={userId[0].firstName}
            avatar={userId[0].avatar}
            occupation={userId[0].occupation}
            profile={profile}
          />
        </div>
      </section>
      {pantallaModal && (
        <div className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800">
          <div className=" bg-black-primario rounded-lg w-1/2">
            <div className="flex flex-col items-start p-4">
              <div className="flex items-center w-full">
                <div className="text-white font-medium text-lg">
                  Eliminar Foto de portada
                </div>
                <svg
                  onClick={() => setPantallaModal(false)}
                  className="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer from-indigo-segundary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 18 18"
                >
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                </svg>
              </div>
              <hr className="bg-white h-1/5" />
              <div className="text-white">
                Seguro que quieres eliminar tu foto de portada?
              </div>
              <hr />
              <div className="ml-auto">
                <button
                  onClick={handleDelete}
                  className="bg-blue-medium hover:bg-blue-medium text-white font-bold py-2 px-4 rounded"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setPantallaModal(false)}
                  className="bg-transparent hover:bg-blue-medium text-blue-medium font-semibold hover:text-white py-2 px-4 border border-blue-medium hover:border-transparent rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
