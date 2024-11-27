import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [kasm, setKasm] = useState(window.localStorage.getItem('kasm-url') || null)
  const [url, setUrl] = useState('')
  const [device, setDevice] = useState(null)


  useEffect(() => {
    window.addEventListener('message', handleMessages)
    return () => {
      window.removeEventListener('message', handleMessages)
    }
  }, []);

  const removeTrailingSlash = (url) => {
    const newUrl = new URL(url)
    newUrl.pathname.endsWith('/') && (newUrl.pathname = newUrl.pathname.slice(0, -1));
    return newUrl.toString()
  }

  const setKasmUrl = (ev) => {
    const newUrl = removeTrailingSlash(url)
    setKasm(newUrl)
    window.localStorage.setItem('kasm-url', newUrl)
  }

  const handleMessages = async (event) => {
    if (kasm && removeTrailingSlash(kasm) === removeTrailingSlash(event.origin)) {
      switch (event.data) {
        case 'connect':
          connect()
        case 'write':
          write()
        break;
      }
    }
  }

  const connect = async () => {
    console.log('wrapper connect')
    try {
      const requestdevice = await navigator.usb.requestDevice({ filters: [] });
      setDevice(requestdevice)
      console.log(requestdevice)
      kasmframe.contentWindow.postMessage({ status: 'connected' }, '*');
    } catch (e) {
      kasmframe.contentWindow.postMessage({ status: 'error', error: e }, '*');
    }
  }

  async function write() {
    console.log('write')
    const cmds = [
      'SIZE 48 mm,25 mm',
      'CLS',
      'TEXT 30,10,"4",0,1,1,"Test"',
      'TEXT 30,50,"2",0,1,1,"WebUSB API"',
      'BARCODE 30,80,"128",70,1,0,2,2,"altospos.com"',
      'PRINT 1',
      'END',
    ];
    
    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);
    let test = await device.transferOut(
      device.configuration.interfaces[0].alternate.endpoints.find(obj => obj.direction === 'out').endpointNumber,
      new Uint8Array(
        new TextEncoder().encode(cmds.join('\r\n'))
      ),
    );
    console.log(test)
    await device.close();
  }
   


  // const Iframe = '<iframe id="kasmframe" style="width:100%; height: 100vh;" src="' + kasm +'" allow="usb; usb-unrestricted; autoplay; microphone; camera; clipboard-read; clipboard-write; window-management; self; ' + kasm + '"></iframe>'
  const Iframe = '<controlledframe id="kasmframe" style="width:100%; height: 100vh;" src="' + kasm +'" allow="usb; usb-unrestricted; autoplay; microphone; camera; clipboard-read; clipboard-write; window-management; self; ' + kasm + '"></controlledframe>'
  
  if (!kasm) {
    return (<div className='fixed inset-0 bg-[#3e445b] flex items-center justify-center'>
      <div className='bg-[#21273f] text-white w-full max-w-5xl h-screen max-h-[600px] p-3 rounded-lg flex shadow-lg font-light'>
      <div className="w-1/2 bg-cover bg-center bg-[url('/background3.jpg')] rounded-md">
      </div>
      <div className='w-1/2 p-16 text-left'>
        <h1 className='text-3xl mb-4 font-thin tracking-wider uppercase'>Select Server</h1>
        <p className='text-xs text-white/60 mb-8'>Select the server to connect to</p>
        <input onChange={(ev) => setUrl(ev.target.value)} className='focus:outline-none focus:ring-purple-500 focus:ring-1 p-2.5 px-4 rounded-md w-full bg-white/5 font-light text-sm mb-4' placeholder={'https://server.com'} type="text" />
        <button onClick={setKasmUrl} className='w-full bg-purple-500 rounded-md py-2.5 text-sm'>Set</button>
      </div>
      
        </div>
      </div>)
  }

  return (<div className='fixed inset-0'><iframe id="kasmframe" style={{ width: '100%', height: '100vh' }} src={kasm} allow={"usb; usb-unrestricted; autoplay; microphone; camera; clipboard-read; clipboard-write; window-management; self; " + kasm}></iframe></div>)
  return (<div className='fixed inset-0'><controlledframe id="kasmframe" style={{ width: '100%', height: '100vh' }} src={kasm} allow={"usb; usb-unrestricted; autoplay; microphone; camera; clipboard-read; clipboard-write; window-management; self; " + kasm}></controlledframe></div>)

  /*return (
    <div className='fixed inset-0' dangerouslySetInnerHTML={ {__html:  Iframe?Iframe:""}} />
  )*/
}

export default App
