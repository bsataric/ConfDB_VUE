import Keycloak from 'keycloak-js'

//declare var keycloak: any

export default {
  initKeyCloaker(serverExists: boolean): any {
    const initOptions = {
      url: 'https://auth.cern.ch/auth',
      realm: 'cern',
      clientId: 'cms-hlt-gui-test',
    }

    if (serverExists) globalThis.keyCloaker = Keycloak(initOptions)
    else globalThis.keyCloaker = null
    /*   console.log(
      'initKeyCloaker KEYCLOAKER: ' + JSON.stringify(globalThis.keyCloaker)
    ) */
  },
}
