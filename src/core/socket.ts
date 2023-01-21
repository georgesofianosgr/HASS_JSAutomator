import { Auth, createConnection, createLongLivedTokenAuth } from 'home-assistant-js-websocket';

export type Connection = Awaited<ReturnType<typeof createConnection>>;
export type Message = Parameters<Connection['sendMessage']>[0];
let connection: Connection | null = null;

const connect = async () => {
  const auth = createLongLivedTokenAuth(process.env.HASS_URL,process.env.ACCESS_TOKEN);
  connection = await createConnection({ auth });
  return connection;
}

const sendMessage = (message: Message) => {
  console.debug(`[sendMessage] ${JSON.stringify(message)}`);
  connection?.sendMessage(message);
}

const subscribeEvents = (clb: (event: Record<string,any>) => void,eventType:string) => {
  console.debug(`[subscribeEvents] ${eventType}`);
  if(!connection) {
    console.warn('[subscribeEvents] Connection is not established');
    return;
  }
  connection.subscribeEvents(clb,eventType);
}

export const Socket = {
  connect,
  connection,
  sendMessage,
  subscribeEvents,
}
