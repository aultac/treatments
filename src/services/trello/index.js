import Promise from 'bluebird';
// dev key: 3ad06cb25802014a3f24f479e886771c
// URL to refresh client lib: https://api.trello.com/1/client.js?key=3ad06cb25802014a3f24f479e886771c

const Trello = Trello || null; // should be globally available?

// Promisify the normal Trello client:
export default {
  authorize: () => {
    return new Promise((resolve,reject) => {
      TrelloClient.authorize({
        type: 'redirect',
        name: 'Ault Farms - Treaments',
        persist: true,
        scope: { read: 'true', write: 'true' },
        expiration: 'never',
        success: resolve,
        error: reject,
      });
    });
  },
   get:  path        => new Promise((resolve,reject) => TrelloClient.get( path,resolve,reject)),
   put: (path,params)=> new Promise((resolve,reject) => TrelloClient.put( path,params,resolve,reject)),
  post: (path,params)=> new Promise((resolve,reject) => TrelloClient.post(path,params,resolve,reject)),
}

