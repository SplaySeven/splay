import React, { useState, useEffect } from "react"
import { getSuggestedProfile } from "../../../lib/db"
import NotFriend from "./notFriend"
import Carousel from "react-simply-carousel";
export default function index({ datos }) {
  const [notFriend, setNotFriend] = useState(null)
  const { userid, following, id } = datos[0]
  const [ activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getSuggestedProfile(userid, following)
      setNotFriend(response)
    }
    if (datos) {
      suggestedProfiles()
    }
  }, [userid])

  const contenedorPrincipal = {
    display: "flex",
    alignitems: "center",
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
  }
  const buttonIzqDer = {
    fontSize: "40px",
    with: "50px",
    cursor: "pointer",
    position: "relative",
    border: "none",
    display: "inline-block",
    zIndex: "500",
    left: "0",
    outline: "0",
  }
  const buttonDerecho = {
    fontSize: "40px",
    with: "50px",
    cursor: "pointer",
    position: "relative",
    border: "none",
    outline: "0",
    display: "inline-block",
    zIndex: "500",
    right: "0",
  }
  const contenedorControles = {
    display: "flex",
    alignitems: "center",
    borderRadius: "10px",
    marginRight: "20px",
    paddingRight: "0px",
    cursor: "pointer",
    position: "relative",
    zIndex: "500",
    
  }

  const derecha = () => {
    const fila = document.querySelector(".contenedor")
    fila.scrollLeft += fila.offsetWidth
  }

  const izquierda = () => {
    const fila = document.querySelector(".contenedor")
    fila.scrollLeft -= fila.offsetWidth
  }
  return (
    <React.Fragment>
      {notFriend === null || notFriend.length === 0 ? (
        <>
          <div className=" col-span-3     md:col-span-3 animate-pulse h-60 bg-gray-splay  ">
            <h1
              className=" animate-pulse text-white "
              style={{
                alignitems: "center",
                textAlign: "center",
                bottom: "50px",
                paddingTop: "95px",
                height: "100%",
              }}
            >
              ....Cargado.......
            </h1>
          </div>
        </>
      ) : (
        <div style={{position: 'relative'}}>
        <Carousel
          updateOnItemClick
          containerProps={{
          style: {
              /*width: "100%",
              justifyContent: "space-between"*/
          }
          }}
          activeSlideIndex={activeSlide}
          activeSlideProps={{
          style: {
              background: "blue"
          }
          }}
          onRequestChange={setActiveSlide}
          forwardBtnProps={{
          children: ">",
          style: {
              width: 50,
              height: 50,
              zIndex: 10,
              alignSelf: "center",
              position: 'relative',
              right: 0,
              zIndex: 10,
              top: '40%',
              position: 'absolute',
              background: '#fbf4f4cc',
              borderRadius: '50%',
              color: '#fff',
          }
          }}
          backwardBtnProps={{
          children: "<",
          style: {
              width: 50,
              height: 50,
              zIndex: 10,
              position: 'relative',
              left: 0,
              zIndex: 10,
              top: '40%',
              position: 'absolute',
              background: '#fbf4f4cc',
              borderRadius: '50%',
              color: '#fff'
          }
          }}
          itemsToShow={5}
          speed={400}
      >
          {/*Array.from({ length: 10 }).map((item, index) => (
          <div 
              style={{
              background: "red",
              width: 150,
              height: 300,
              border: "10px solid white",
              textAlign: "center",
              lineHeight: "240px",
              boxSizing: "border-box"
              }}
              key={index}
          >
              {index}
          </div>
          ))*/}
          {notFriend
          .map((notfriend) => (
            <NotFriend
              key={notfriend.userid}
              firstName={notfriend.firstName}
              lastName={notfriend.lastName}
              avatar={notfriend.avatar}
              profilePhoto={notfriend.profilePhoto}
              friendId={notfriend.userid}
              userid={userid}
              docId={notfriend.docId}
              id={id}
            />
          ))
          .reverse()}

      </Carousel>
        {/*
          <div
            className="col-span-3 md:col-span-3 "
            style={contenedorPrincipal}
          >
            <button
              onClick={derecha}
              role="button"
              id="flecha-izquierda"
              style={buttonIzqDer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div
              id="contenedor"
              className=" contenedor "
              style={contenedorPrincipal}
            >
              <div style={contenedorControles}>
                {notFriend
                  .map((notfriend) => (
                    <NotFriend
                      key={notfriend.userid}
                      firstName={notfriend.firstName}
                      lastName={notfriend.lastName}
                      avatar={notfriend.avatar}
                      profilePhoto={notfriend.profilePhoto}
                      friendId={notfriend.userid}
                      userid={userid}
                      docId={notfriend.docId}
                      id={id}
                    />
                  ))
                  .reverse()}
              </div>
            </div>

            <button
              onClick={izquierda}
              role="button"
              id="flecha-derecho"
              style={buttonDerecho}
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
      */}
        </div>
      )}
    </React.Fragment>
  )
}