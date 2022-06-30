const miModulo = (() => {
  "use strict";

  // Primero vamos a crear el deck con todas las cartas.

  let deck = [];

  // Como las cartas están nombradas en base a tipo de carta que es, el
  // deck completo se puede reconstruir con varios ciclos for.

  const tipos = ["C", "S", "H", "D"],
    especiales = ["A", "J", "Q", "K"];

  let puntosJugadores = [];

  // Referencias del HTML

  // const btnPedir = document.querySelector("#btnPedir");
  const btnPedir = document.getElementById("btnPedir"),
    btnDetener = document.getElementById("btnDetener"),
    btnNuevoJuego = document.getElementById("btnNuevo"),
    contador = document.querySelectorAll("small"),
    divCartasJugadores = document.querySelectorAll(".divCartas");

  const inicializarJuego = (numJugadores = 2) => {
    console.clear();
    deck = crearDeck();
    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++) {
      puntosJugadores.push(0);
    }

    contador.forEach((elem) => (elem.innerText = 0));

    divCartasJugadores.forEach((elem) => (elem.innerHTML = ""));

    btnPedir.disabled = false;
    btnDetener.disabled = false;
  };

  const crearDeck = () => {
    deck = [];

    for (let i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }

    for (let tipo of tipos) {
      for (let especial of especiales) {
        deck.push(especial + tipo);
      }
    }
    return _.shuffle(deck);
  };

  // El primer juego de ciclos for sirve para generar la numeración de las
  // cartas, del 2 al 10 (y esto es así por la numeración de la baraja);
  // Y el ciclo for of interno, le concatena el tipo.

  // El segundo ciclo for dentro de la función genera las cartas
  // especiales.

  // Para hacer el shuffle del deck vamos a importar una librería que
  // se llama Underscore. En este caso generamos nuestro propio archivo
  // con la versión compacta de la librería. Pero hay mejores formas de
  // hacer esto.

  const pedirCarta = () => {
    return deck.shift();
  };

  const valorCarta = (carta) => {
    let valor = carta.substring(0, carta.length - 1);
    return isNaN(valor) ? (valor === "A" ? 11 : 10) : Number(valor);
  };

  // Turno: el 0 es el primer jugador y el último es la computadora
  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    contador[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno];
  };

  const crearCarta = (carta, turno) => {
    const imgCarta = document.createElement("img");
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.classList.add("carta");
    divCartasJugadores[turno].append(imgCarta);
  };

  const determinarGanador = () => {
    const [puntosAIgualar, puntosComputadora] = puntosJugadores;

    setTimeout(() => {
      if (puntosAIgualar === puntosComputadora) {
        alert("Empate. Volvé a jugar para desempatar");
      } else if (puntosAIgualar > 21) {
        alert("Lo siento, perdiste. Volvé a Jugar");
      } else if (puntosComputadora > 21) {
        alert("¡Ganaste esta partida de Blackjack!");
      } else {
        alert("Lo siento, perdiste. Volvé a Jugar");
      }
    }, 500);
  };

  const turnoComputadora = (puntosAIgualar) => {
    let puntosComputadora = 0;
    do {
      const carta = pedirCarta();
      puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
      //Barajar y dar cartas
      crearCarta(carta, puntosJugadores.length - 1);
    } while (puntosComputadora < puntosAIgualar && puntosAIgualar <= 21);
    determinarGanador();
  };

  // Eventos

  btnPedir.addEventListener("click", () => {
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta, 0);

    //Barajar y dar cartas
    crearCarta(carta, 0);

    //para controlar el puntaje

    if (puntosJugador > 21) {
      console.warn("Lo siento, perdiste");
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
      console.warn("21, ¡Genial!");
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    }
  });

  btnDetener.addEventListener("click", () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnoComputadora(puntosJugadores[0]);
  });

  btnNuevoJuego.addEventListener("click", () => {
    inicializarJuego();
  });

  return {
    nuevoJuego: inicializarJuego,
  };
})();
