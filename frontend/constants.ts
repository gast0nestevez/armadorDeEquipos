const production = {
  environment: 'production',
  clientId: '312146115793-rqafksbjmodtd0pcajtsd5qvam7vfeue.apps.googleusercontent.com',
  apiUrl: 'https://armadordeequipos.onrender.com',
}

const development = {
  environment: 'development',
  clientId: '312146115793-rqafksbjmodtd0pcajtsd5qvam7vfeue.apps.googleusercontent.com',
  apiUrl: 'https://armadordeequipos.onrender.com',
}

const environment = import.meta.env.VITE_ENV as string
export const config = environment === 'production' ? production : development
