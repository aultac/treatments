import Promise from 'bluebird';
// dev key: 3ad06cb25802014a3f24f479e886771c
// URL to refresh client lib: https://api.trello.com/1/client.js?key=3ad06cb25802014a3f24f479e886771c

// Promisify the normal Trello client:
export default {
  isLoaded: () => {
    return !!(window.Trello);
  },
  authorize: () => {
    return new Promise((resolve,reject) => {
      window.Trello.authorize({
        type: 'redirect',
        name: 'Ault Farms - Treaments',
        persist: true,
        scope: { read: 'true', write: 'true' },
        expiration: 'never',
        success: resolve,
        error: (err) => { console.log('Failed to authorize Trello: err = ', err); reject(err); }
      });
    });
  },
   get: (path,params)=> new Promise((resolve,reject) => window.Trello.get( path,params||{},resolve,err => { console.log('Trello.get ERROR: ', err); reject(err); })),
   put: (path,params)=> new Promise((resolve,reject) => window.Trello.put( path,params    ,resolve,err => { console.log('Trello.put ERROR: ', err); reject(err); })),
  post: (path,params)=> new Promise((resolve,reject) => window.Trello.post(path,params    ,resolve,err => { console.log('Trello.post ERROR: ',err); reject(err); })),
}

