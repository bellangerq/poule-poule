import * as SignalR from '@microsoft/signalr'
import { HubConnection } from '@microsoft/signalr'

const API_URL: string = 'https://localhost:5001'

const connectToHub = (
  hubName: string,
  playerId: string,
  onStart: any = null
): HubConnection => {
  const connection = new SignalR.HubConnectionBuilder()
    .withUrl(`${API_URL}/${hubName}?playerId=${playerId}`)
    .withAutomaticReconnect()
    .configureLogging(SignalR.LogLevel.Debug)
    .build()

  connection
    .start()
    .then(() => onStart && onStart())
    .catch(err => console.log(err))

  return connection
}

export default connectToHub
