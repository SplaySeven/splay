import React, { useState, useEffect } from "react"
import Comment from "./Comment"
import { useAuth } from "../../../../../lib/auth"
import { listenLatesComentarios } from "../../../../../lib/db"
import firebase from "../../../../../lib/firebase"
import Avatar from "./Avatar"
export default function index({ commentId }) {
  const { user } = useAuth()
  const [comentarios, setComentarios] = useState("")

  const [dataComentarios, setDataComentarios] = useState(undefined)
  useEffect(() => {
    let unsubscribe
    if (user.uid) {
      unsubscribe = listenLatesComentarios((newComentarios) => {
        setDataComentarios(newComentarios)
      })
      return () => unsubscribe && unsubscribe()
    }
  }, [user.uid])

  if (dataComentarios === undefined) return null
  const datos = dataComentarios
    .filter((e) => e.idPublication === commentId)
    .sort((a, b) => a.createAt - b.createAt)

  // Enviamos Comentarios
  const send = async () => {
    await firebase
      .firestore()
      .collection("comments")
      .add({
        comment: comentarios,
        createAt: firebase.firestore.Timestamp.fromDate(new Date()),
        idPublication: commentId,
        idUser: user.uid,
        state: "true",
      })
    setComentarios("")
  }
  return (
    <React.Fragment>
      {datos
        .map((publi) => (
          <Comment
            key={publi.id}
            comment={publi.comment}
            createAt={publi.createAt}
            idUser={publi.idUser}
            commentId={publi.id}
            currentUserId={user.uid}
          />
        ))
        .reverse()}

      <div className="col-span-12 mb-5">
        <div
          className="grid grid-cols-10 gap-1"
          style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
        >
          <div className=" col-span-2 ml-2 md:col-span-1">
            <p className="text-left">
              <Avatar idUser={user.uid} />
            </p>
          </div>
          <div
            className="col-span-9 px-2 md:px-0"
            style={{ gridColumn: "span 14 / span 14" }}
          >
            <div
              style={{
                padding: "5px 15px",
                background: "#ddd",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            >
              <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                {user.name}
              </p>
              <p>
                <textarea
                  placeholder="Escribe un comentario"
                  style={{
                    width: "100%",
                    background: "unset",
                    fontSize: "0.8rem",
                    paddingLeft: 5,
                    paddingRight: 5,
                    outline: "none"
                  }}
                  onChange={(e) => setComentarios(e.target.value)}
                  value={comentarios}
                />
              </p>
              {comentarios && (
                <div className="text-center">
                  <button onClick={send}>
                    <img
                      src="/icons/send.png"
                      style={{ width: "20px", display: "inline-block" }}
                    />{" "}
                    Enviar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

// src="/icons/like.png"
