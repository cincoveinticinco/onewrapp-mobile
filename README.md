## OneWrapp Offline

<a name="readme-top"></a>

<div align="center">

  <img src="./src/assets/images/logo_onewrapp.png" alt="logo" width="140" height="auto" />
  <br/>

</div>

# 📗 Table of Contents

- [📖 OneWrapp Offline](#onewrapp-offline)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
  - [💻 Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Install](#install)
    - [Usage](#usage)
    - [Run tests](#run-tests)
    - [Deployment](#deployment)
  - [📝 License](#license)

# 📖 OneWrapp Offline <a name="about-project"></a>

**OneWrapp Offline** es una aplicación multiplataforma diseñada para funcionar sin conexión, utilizando **React** e **Ionic** junto con **Capacitor** y **RxDB** para la sincronización de datos locales. El backend está desarrollado en **Ruby on Rails**, y la aplicación está preparada para iOS y Android.

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
<summary>Frontend</summary>
  <ul>
    <li><a href="https://reactjs.org/">React</a></li>
    <li><a href="https://ionicframework.com/">Ionic</a></li>
    <li><a href="https://capacitorjs.com/">Capacitor</a></li>
    <li><a href="https://rxdb.info/">RxDB</a></li>
  </ul>
</details>

<details>
<summary>Backend</summary>
  <ul>
    <li><a href="https://rubyonrails.org/">Ruby on Rails</a></li>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

### Key Features <a name="key-features"></a>

- **Sincronización de datos offline utilizando RxDB**
- **Multiplataforma: soporte para iOS y Android**
- **Backend en Ruby on Rails para la gestión de datos**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 💻 Getting Started <a name="getting-started"></a>

Para obtener una copia local del proyecto y ejecutarlo, sigue estos pasos.

### Prerequisites

Asegúrate de tener las siguientes herramientas instaladas en tu entorno local:

- **Node.js v22.2.0** o superior.
- **Ionic CLI**: `npm install -g @ionic/cli`
- **Capacitor 5.6**: `npm install @capacitor/core@5.6`
- **Ruby v 2.6.3**: `https://www.ruby-lang.org/en/documentation/installation/`
- **PostgreSQL**: `https://www.postgresql.org/download/`
- **Cocoapods** (para iOS): `sudo gem install cocoapods`

### Setup

1. Clona el repositorio:
    ```sh
    git clone https://github.com/tu-usuario/onewrapp-offline.git
    cd onewrapp-offline
    ```

2. Pide el archivo `.env` al desarrollador y colócalo en el directorio raíz del proyecto.

### Install

1. Instala las dependencias del frontend y backend:
    ```sh
    npm install
    bundle install
    ```

2. Configura la base de datos para el backend:
    ```sh
    rails db:create
    rails db:migrate
    ```

### Usage

Para ejecutar el proyecto localmente, sigue los siguientes pasos:

#### Para el Frontend (servidor de desarrollo)
```sh
ionic serve
```

#### Para agregar la plataforma Android:
```sh
ionic capacitor add android
ionic cap open android
```
o simplemente:
```sh
ionic capacitor run android
```

#### Para agregar la plataforma iOS:
```sh
ionic capacitor add ios
ionic cap open ios
```
o simplemente:
```sh
ionic capacitor run ios
```

#### Para correr la aplicación en Android con livereload:
```sh
ionic capacitor run android -l --external
```

#### Para correr la aplicación en iOS con livereload:
```sh
ionic capacitor run ios -l --external
```

#### Nota: Para el livereload, asegúrate de que la URL de tu servidor local esté configurada en el archivo capacitor.config.ts:

```typescript
const config = {
  server: {
    url: 'http://TU_IP_LOCAL:8100',
    cleartext: true
  }
};
export default config;
```
# 📝 License <a name="license"></a>

Este proyecto está licenciado bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENCE) para obtener más información.

<p align="right">(<a href="#readme-top">back to top</a>)</p>