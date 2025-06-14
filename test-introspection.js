// Define the two message types for the subscriptions-transport-ws protocol
const GQL = {
  CONNECTION_INIT: 'connection_init',
  START:           'start'
};

// Create the WebSocket, speaking the 'graphql-ws' subprotocol
const ws = new WebSocket(
  'wss://merusimulation.atlassian.net/cgraphql',
  'graphql-ws'
);

ws.onopen = () => {
  // 1) Tell the server we’re ready to start a GraphQL session
  ws.send(JSON.stringify({
    type:    GQL.CONNECTION_INIT,
    payload: {}          // you can put auth tokens here if required
  }));

  // 2) Actually fire off our introspection query
  const introspectionQuery = `
    {
      __schema {
        types {
          name
        }
      }
    }
  `;

  ws.send(JSON.stringify({
    id:      '1',        // arbitrary client-generated ID
    type:    GQL.START,
    payload: {
      query:     introspectionQuery,
      variables: {}
    }
  }));
};

ws.onmessage = (event) => {
  // Log whatever the server sends back
  console.log('‹GraphQL WS›', event.data);
  // You could also parse and inspect:
  // const msg = JSON.parse(event.data);
  // console.log(msg);
};

ws.onerror = (err) => {
  console.error('WebSocket error:', err);
};

ws.onclose = (evt) => {
  console.log('WebSocket closed:', evt.code, evt.reason);
};
