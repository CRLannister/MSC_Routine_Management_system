const ipc = require('electron').ipcRenderer;

const printPDFButton =document.getElementById('print-pdf');

printPDFButton.addEventListener('click',event => {
	ipc.send('print-to-pdf');

});

ipc.on('wrote-pdf',(event,path) =>{
	const message = `Wrote pdf to : ${path}`;
	document.getElementById('pdf-path').innerHTML = message;})

