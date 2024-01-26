const HerokuClient = require('heroku-client');
const fs = require('fs');

async function Heroku(action, param) {
  let heroku = new HerokuClient({
   token: process.env?.HEROKU_API_KEY
  })
  if (action == 'shutdown') {
   return await heroku.get(`/apps/${process.env.HEROKU_APP_NAME}/formation`).then(async (formation) => {
    await heroku.patch(`/apps/${process.env.HEROKU_APP_NAME}/formation/${formation[0].id}`, {
      body: {
       quantity: 0
      }
     });
    }).catch(async (err) => {
      console.error(err);
      return false;
    });
  } else if (action == 'restart') {
   return await heroku.delete(`/apps/${process.env.HEROKU_APP_NAME}/dynos`)
   .catch(async (e) => { 
    console.log(e);
    return false;
   });
  } else if (action == 'setenv') {
   return await heroku.patch(`/apps/${process.env.HEROKU_APP_NAME}/config-vars`, { 
    body: { 
      [param[0]]: param[1]
    } 
   }).catch(async (e) => { 
    console.log(e);
    return false;
   });
  } else if (action == 'delenv') {
   return await heroku.get(`/apps/${process.env.HEROKU_APP_NAME}/config-vars`)
    .then(async (envs) => {
      for (env in envs) {
       if (param.trim() == env) {
        return await heroku.patch(`/apps/${process.env.HEROKU_APP_NAME}/config-vars`, {
         body: {
          [env]: null
         }
        });
       }
      }
      return false;
    })
    .catch(async (e) => {
     console.log(e);
     return false;
    });
  } else if (action == 'getenv') {
   return await heroku.get(`/apps/${process.env.HEROKU_APP_NAME}/config-vars`)
    .then(async (envs) => {
      for (env in envs) {
       if (param.trim() == env) return [env, envs[env]];
      }
      return false;
    }).catch(async (e) => {
      console.log(e);
      return false;
    });
  }
}

module.exports = { Heroku };
