To get a working demo:

## Backend server

Use the KASM-6726 front end feature branch (this adds a testing connect button)

Kasm Proxy needs the following headers

add_header      'Cross-Origin-Resource-Policy' 'cross-origin';
add_header      'Cross-Origin-Embedder-Policy' 'require-corp';

In Kasmweb got to Settings / General
Find "Same Site Policy" and set it to None

## Install the IWA

You can either run the IWA on localhost with `npm run dev` or build the IWA with `npm run build` the test certs don't have a password so just hit enter when asked.
The IWA will be output to `dist/kasm.swbn`
Go to chrome://flags and enable:
- Enable Isolated Web Apps
- Enable Isolated Web App Developer Mode
- Enable Isolated Web Apps to bypass USB restrictions

Go to chrome://web-app-internals ands install the IWA (either "Install IWA via Dev Mode Prox" if running on localhost or select the file in "Install IWA from Signed Web Bundle")

## Run the demo

After installing the IWA, launch it and enter the server URL (if you need to reset it for some reason go to dev tools / application / Local storage / isolate-app://... and delete the kasm-url)

After logging in there should be a connect button at the top left, click it it should allow you to select a usb device, select the smart card. If a usb list doesn't show up when clicking the button, right click on the IWA and click on reload.

If it's working you will get `Uncaught (in promise) NetworkError: Failed to execute 'claimInterface' on 'USBDevice': Unable to claim interface.` unless you are using chrome and have set the UsbDetachableAllowlist and added 04e6:5116 
