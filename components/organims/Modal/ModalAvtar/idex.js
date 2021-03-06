import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import firebase from "../../../../lib/firebase"

const storage = firebase.storage()
export default function index(props) {
  const { userData } = props

  const { show, setShowModal } = props
  const [fileUpload, setFileUpload] = useState(null)
  const [comentarios, setComentarios] = useState(null)
  const [uploadValue, setUploadValue] = useState(0)
  const [picureUrl, setPicureUrl] = useState(null)
  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0]
    setFileUpload({
      type: "image",
      file,
      preview: URL.createObjectURL(file),
    })
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    noKeyboard: true,
    multiple: false,
    onDrop,
  })

  const Modal = () => {
    setFileUpload(null)
    setComentarios(null)
    setUploadValue(0)
    setPicureUrl(null)
    setShowModal(false)
  }

  const onPublish = async () => {
    const file = fileUpload.file
    const storageRef = await storage.ref(`imagenes/${file.name}`)
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
          .ref("imagenes")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            setPicureUrl(url)
            //guardamos en publication de firebase
            firebase.firestore().collection("Publication").add({
              idUser: userData.userid,
              file: url,
              comments: comentarios,
              state: "T",
              typeFile: fileUpload.type,
              dateCreate: Date.now(),
            })
          })
        setUploadValue(100)
        setUploadValue(0)
        setFileUpload(null)
        setShowModal(false)
      }
    )
  }
  return (
    <React.Fragment>
      {show ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-7xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}

                {/*body*/}
                <div
                  className="relative p-4 h-96 w-96 flex-auto content-center justify-center text-center border 2px border-dashed  rounded-md"
                  style={fileUpload && { border: 0 }}
                  {...getRootProps()}
                >
                  {!fileUpload && (
                    <>
                      <p className="my-4 text-blueGray-500 text-lg leading-relaxed justify-center">
                        Arrastra tu foto o video que quieras publicar
                      </p>
                    </>
                  )}
                  <input {...getInputProps()} />
                  {fileUpload?.type === "image" && (
                    <div
                      className="top-0 left-0 w-full h-full bg-repeat bg-center bg-cover absolute rounded-md "
                      style={{
                        backgroundImage: `url("${fileUpload.preview}")`,
                      }}
                    />
                  )}
                </div>

                {/*footer*/}
                <div className=" flex-col items-center justify-end p-2  rounded-b">
                  {fileUpload && (
                    <div className="mt-1">
                      <textarea
                        className="w-full"
                        placeholder="Que esta pensado"
                        onChange={(e) => setComentarios(e.target.value)}
                      />
                    </div>
                  )}
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={Modal}
                  >
                    Cerrar
                  </button>
                  {fileUpload && (
                    <>
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={onPublish}
                      >
                        Publicar
                      </button>
                      <div className="w-full">
                        <progress value={uploadValue} max="100"></progress>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </React.Fragment>
  )
}
