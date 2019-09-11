import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

export default class Pajarito extends Component {
  constructor() {
    super();
    this.updateData = this.updateData.bind(this);
    this.state = {
      remoteData: {
        ip: 'un montón de números',
        isp: 'una entidad desconocida',
        district: 'un barrio',
        city: 'de una cuidad',
        country: 'posiblemente de un país',
      },
      localData: {
        isMobile: false,
        browser: 'un nido',
        os: 'un arbol',
        usedScreen: 'un pedacito',
        colorDepth: 'algunos',
        colors: 'un montón',
      }
    }
  }

  async componentDidMount() {
    const GEO_DATA = await getGeoData();
    this.setState({
      remoteData: {
        ip: GEO_DATA.ip,
        isp: GEO_DATA.isp,
        district: GEO_DATA.district,
        city: GEO_DATA.state_prov,
        country: GEO_DATA.country_name,
      }
    });
    this.updateData();
  }

  async updateData() {
    const LOCAL_DATA = await getLocalData();
    // Adding punctuation to a long number
    // E.g.: 120000 to 120.000
    const COL = 2 ** LOCAL_DATA.colorDepth;
    const LEN = COL.toString().length;
    const STR = COL.toString();
    let read = [];
    let aux = 2;
    for (let i = LEN - 1; i >= 0; i--) {
      if (0 <= aux) {
        read.unshift(STR.slice(i, i + 1));
        aux--;
      } else {
        read.unshift('.');
        aux = 2;
        i++;
      }
    }
    // Punctuation done
    this.setState({
      localData: {
        isMobile: LOCAL_DATA.isMobile,
        browser: LOCAL_DATA.browser,
        os: LOCAL_DATA.os,
        usedScreen: LOCAL_DATA.usedScreen,
        colorDepth: LOCAL_DATA.colorDepth,
        colors: read.concat(''),
      }
    });
    requestAnimationFrame(this.updateData);
  }

  render() {
    return (
      <Router>
        <div className="Pajarito">
          <Route exact path="/le-cuenta-un-pajarito/" render={props => (
            <>{/* /le-cuenta-un-pajarito/ */}
              <div className="img-box">
                <img src="/le-cuenta-un-pajarito/Final_alpha.png"
                  alt="A bird."
                  className="Pajarito_img--home"
                  draggable="false" />
                <img src="/le-cuenta-un-pajarito/Final_happy_alpha_alt.png"
                  alt="A blinking bird."
                  className="Pajarito_img-blink--home"
                  draggable="false" />
              </div>
              <section className="Pajarito_text--home">
                <div className="text-holder--home">
                  {/* 1 */}<p>Pio.</p>
                  {/* 2 */}<p>Le cuento:</p>
                  {/* 3 */}<p>Trino desde{' '}
                    {this.state.localData.isMobile &&
                      <>
                        un dispositivo movil, en
                      </>
                    }
                    <span className="data"> {this.state.localData.browser} </span>sobre
                    <span className="data"> {this.state.localData.os}</span>.
                  </p>
                  {/* 4 */}<p>Su IP es
                    <span className="data"> {this.state.remoteData.ip}</span>,
                    <span className="data"> "{this.state.remoteData.isp}" </span>
                    es su proveedor de internet, con sede en
                    <span className="data"> {this.state.remoteData.district}</span>,
                    <span className="data"> {this.state.remoteData.city}</span>,
                    <span className="data"> {this.state.remoteData.country}</span>.
                  </p>
                  {/* 5 */}<p>
                    {(this.state.localData.usedScreen < 50) &&
                      <>
                        Le pio por favor agrande la ventana, ocupo apenas un
                        <span className="data"> {this.state.localData.usedScreen}% </span>
                      </>
                    }
                    {(this.state.localData.usedScreen >= 50) &&
                      <>
                        Parece que tengo pioridad, cubro
                        <span className="data"> {this.state.localData.usedScreen}% </span>
                      </>
                    }
                    de su pantalla, un componente con profundidad de color de
                    <span className="data"> {this.state.localData.colorDepth} bits
                      ({this.state.localData.colors} colores)</span>.
                  </p>
                  {/* 6 */}<p>Por su seguridad! Lea
                    mi <Link to="/le-cuenta-un-pajarito/piolitica/">piolítica de privacidad</Link> y
                    siéntase más tranquilo.
                  </p>
                </div>
              </section>
            </>
          )} />
          <Route path="/le-cuenta-un-pajarito/piolitica/" render={props => (
            <>{/* /le-cuenta-un-pajarito/piolitica/ */}
              <Link className="back_btn" to="/le-cuenta-un-pajarito/">{'<'}</Link>
              <img src="/le-cuenta-un-pajarito/Piolitica.png"
                alt="A piolitic bird."
                className="Pajarito_img--piolitica"
                draggable="false" />
              <section className="Pajarito_text--piolitica">
                <div className="text-holder--piolitica">
                  <p>No diré nada n.n</p>
                </div>
              </section>
            </>
          )} />
        </div>
      </Router>
    )
  }
}

async function getGeoData() {
  const RES = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=15d8e57eb4aa4015bb32a04d73b67b19');
  if (RES.status > 200) return RES.status;
  else {
    const RES_JSON = await RES.json();
    return {
      ip: RES_JSON.ip,
      isp: RES_JSON.isp,
      district: RES_JSON.district,
      state_prov: RES_JSON.state_prov,
      country_name: RES_JSON.country_name,
      //country_flag: RES_JSON.country_flag,
    };
  }
}

async function getLocalData() {
  const AGENT = window.navigator.userAgent;
  const VER = window.navigator.appVersion;
  let browser = navigator.appName;
  let browserVer = '' + parseFloat(navigator.appVersion);
  let browserMajorVer = parseInt(navigator.appVersion, 10);
  let vOff = undefined;
  let ix = undefined;
  let nameOff = undefined;
  // Opera
  if ((vOff = AGENT.indexOf('Opera')) !== -1) {
    browser = 'Opera';
    browserVer = AGENT.substring(vOff + 6);
    if ((vOff = AGENT.indexOf('Version')) !== -1) browserVer = AGENT.substring(vOff + 8);
  }
  // Opera Next
  if ((vOff = AGENT.indexOf('OPR')) !== -1) {
    browser = 'Opera';
    browserVer = AGENT.substring(vOff + 4);
  }
  // Edge
  else if ((vOff = AGENT.indexOf('Edge')) !== -1) {
    browser = 'Microsoft Edge';
    browserVer = AGENT.substring(vOff + 5);
  }
  // MSIE
  else if ((vOff = AGENT.indexOf('MSIE')) !== -1) {
    browser = 'Microsoft Internet Explorer';
    browserVer = AGENT.substring(vOff + 5);
  }
  // Chrome
  else if ((vOff = AGENT.indexOf('Chrome')) !== -1) {
    browser = 'Chrome';
    browserVer = AGENT.substring(vOff + 7);
  }
  // Safari
  else if ((vOff = AGENT.indexOf('Safari')) !== -1) {
    browser = 'Safari';
    browserVer = AGENT.substring(vOff + 7);
    if ((vOff = AGENT.indexOf('Version')) !== -1) browserVer = AGENT.substring(vOff + 8);
  }
  // Firefox
  else if ((vOff = AGENT.indexOf('Firefox')) !== -1) {
    browser = 'Firefox';
    browserVer = AGENT.substring(vOff + 8);
  }
  // MSIE 11+
  else if (AGENT.indexOf('Trident/') !== -1) {
    browser = 'Microsoft Internet Explorer';
    browserVer = AGENT.substring(AGENT.indexOf('rv:') + 3);
  }
  // Other browsers
  else if ((nameOff = AGENT.lastIndexOf(' ') + 1) < (vOff = AGENT.lastIndexOf('/'))) {
    browser = AGENT.substring(nameOff, vOff);
    browserVer = AGENT.substring(vOff + 1);
    if (browser.toLowerCase() === browser.toUpperCase()) browser = navigator.appName;
  }
  // trim the version string
  if ((ix = browserVer.indexOf(';')) !== -1) browserVer = browserVer.substring(0, ix);
  if ((ix = browserVer.indexOf(' ')) !== -1) browserVer = browserVer.substring(0, ix);
  if ((ix = browserVer.indexOf(')')) !== -1) browserVer = browserVer.substring(0, ix);

  browserMajorVer = parseInt('' + browserVer, 10);
  if (isNaN(browserMajorVer)) {
    browserVer = '' + parseFloat(navigator.appVersion);
    browserMajorVer = parseInt(navigator.appVersion, 10);
  }

  // mobile version
  const MOBILE = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(VER);

  // system
  let os = undefined;
  let clientStrings = [
    { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
    { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
    { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
    { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
    { s: 'Windows Vista', r: /Windows NT 6.0/ },
    { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
    { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
    { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
    { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
    { s: 'Windows 98', r: /(Windows 98|Win98)/ },
    { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
    { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
    { s: 'Windows CE', r: /Windows CE/ },
    { s: 'Windows 3.11', r: /Win16/ },
    { s: 'Android', r: /Android/ },
    { s: 'Open BSD', r: /OpenBSD/ },
    { s: 'Sun OS', r: /SunOS/ },
    { s: 'Linux', r: /(Linux|X11)/ },
    { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
    { s: 'Mac OS X', r: /Mac OS X/ },
    { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
    { s: 'QNX', r: /QNX/ },
    { s: 'UNIX', r: /UNIX/ },
    { s: 'BeOS', r: /BeOS/ },
    { s: 'OS/2', r: /OS\/2/ },
    { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
  ];
  for (let id in clientStrings) {
    let cs = clientStrings[id];
    if (cs.r.test(AGENT)) {
      os = cs.s;
      break;
    }
  }

  let osVer = undefined;
  if (/Windows/.test(os)) {
    osVer = /Windows (.*)/.exec(os)[1];
    os = 'Windows';
  }

  switch (os) {
    case 'Mac OS X':
      osVer = /Mac OS X (10[._\d]+)/.exec(AGENT)[1];
      break;
    case 'Android':
      osVer = /Android ([._\d]+)/.exec(AGENT)[1];
      break;
    case 'iOS':
      osVer = /OS (\d+)_(\d+)_?(\d+)?/.exec(VER);
      osVer = osVer[1] + '.' + osVer[2] + '.' + (osVer[3] | 0);
      break;
    default: // something is wrong
      break;
  }

  const SC_TOTAL = window.screen.width * window.screen.height;
  const SC_USED = window.innerWidth * window.innerHeight;

  return {
    isMobile: MOBILE,
    browser: browser + ' ' + browserMajorVer + ` (${browserVer})`,
    os: os + ' ' + osVer,
    usedScreen: Math.round((SC_USED / SC_TOTAL) * 100),
    colorDepth: window.screen.colorDepth,
  }
}

// https://api.ipgeolocation.io/ipgeo?apiKey=15d8e57eb4aa4015bb32a04d73b67b19
// http://webkay.robinlinus.com/

// https://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
// Answer by Ludwing
