import React, { FC, useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import moment from 'moment'
import { RouteComponentProps } from '@reach/router'

import connectToGameHub from '../../utils/signalrConnector'
import { Game } from '../../types/Game'
import { Settings as SettingsType } from '../../types/Settings'
import { Difficulty } from '../../types/Difficulty'
import Settings from '../../containers/Settings'
import './Lobby.scss'
import PlayerBox from '../../components/PlayerBox'

export interface LobbyProps extends RouteComponentProps {
  id?: string
}

const Lobby: FC<LobbyProps> = (props: LobbyProps) => {
  const [game, setGame] = useState<Game>()
  const [currentPlayerId, setCurrentPlayerId] = useState<string>()

  useEffect(() => {
    const loadGame = async () => {
      const getGameResponse: AxiosResponse<Game> = await axios.get(
        `/games/${props.id}`
      )
      return getGameResponse.data
    }
    const onLoad = async () => {
      var game = await loadGame()
      setGame(game)

      if (game.status === 'PENDING_START') {
        const hubConnection = connectToGameHub(game.id)
        hubConnection.start().then(() => {
          hubConnection.connectionId &&
            setCurrentPlayerId(hubConnection.connectionId)
        })
        hubConnection.on('refreshGame', () => {
          loadGame().then(game => setGame(game))
        })
      }
    }

    onLoad()
  }, [props.id])

  // The oldest member of the lobby is the host
  const isGameHost = (game: Game, playerId: string | undefined) => {
    return game.players && game.players[0].id === playerId
  }

  const defaultSettings: SettingsType = {
    difficulty: Difficulty.EASY,
    roundsToWin: 10,
    cardSpeed: 1.5
  }

  return (
    <div className='Lobby'>
      {game && (
        <>
          <Settings settings={defaultSettings} />
          <h1>Details de la partie ({game.id})</h1>
          <h2>{`Créé ${moment.utc(game.creationDate).fromNow()}`}</h2>
          <h2>Niveau de difficulté: {game.difficulty}</h2>
          <h2>Temps entre chaque carte: {game.cardSpeed} secondes</h2>
          <h2>Nombre de manches pour gagner: {game.roundsToWin}</h2>
          <div className='Players'>
            {game.players.map(player => (
              <PlayerBox
                key={player.id}
                name={player.name}
                isSelf={currentPlayerId === player.id || false}
                isHost={isGameHost(game, player.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Lobby
