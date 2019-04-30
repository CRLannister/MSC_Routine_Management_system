const electron = require('electron');
const path = require('path');
const url = require('url');
// const ipc= electron.ipcMain;
// const ipc_r=require('electron').ipcRenderer;
//set Env
process.env.NODE_ENV = 'development';
const {app, BrowserWindow, Menu, ipcMain} = electron;
const fs = require('fs');
const os = require('os');
const {shell} = require('electron') // deconstructing assignment
const dir_prefix_name = app.getAppPath();
const pdf_path = dir_prefix_name + "/pdf_dir/";
console.log(pdf_path);

var db='';
let mainWindow;
let addWindow;


app.on('window-all-closed', function() {
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1000, height: 720});

  // and load the index.html of the app.
  //mainWindow.loadURL('file://' + __dirname + '/index.html');
     mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'menu.html'),
    protocol: 'file:',
    slashes:true
  }));

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
	  app.quit();
  });

  /*
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
  */
});

// Handle add item window
function createWindow(TITLE,HTML_FILE){
  addWindow = new BrowserWindow({
    show:false,
    width: 1000,
    height:720,
    title:TITLE,
    //titleBarStyle: 'default',
    parent: mainWindow 
  });
	addWindow.once('ready-to-show', () => {
		addWindow.show()
	});
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, HTML_FILE),
    protocol: 'file:',
    slashes:true
  }));

  //const menu = new Menu();
  // Handle garbage collection

  addWindow.on('close', function(){
    addWindow = null;
  });
}


// Catch item:add
ipcMain.on('Teacher:add', function(e, teacher_name, teacher_initials){
  mainWindow.webContents.send('Teacher:Store',teacher_name, teacher_initials);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


ipcMain.on('Subject:add', function(e, Subject_name){
  mainWindow.webContents.send('Subject:Store',Subject_name);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


ipcMain.on('Database:add', function(e, item){
  console.log(item);
  mainWindow.webContents.send('DataBase:Create', item);
  addWindow.close();
  createWindow("Students' Routine", "index.html");
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});

ipcMain.on('Routine:add', function(e, Routine_name){
  console.log(Routine_name);
  mainWindow.webContents.send('Routine:Create', Routine_name);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


ipcMain.on('Routine:old', function(e, Routine_name){
  console.log(Routine_name);
  mainWindow.webContents.send('Routine:append', Routine_name);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


//EDIT FROM PRASHANT
//Button clicks handler.
//Every button in the program sends a "button clicked" event and ID as the parameter.
//some clicks might not have functionality.

ipcMain.on('buttonClicked', function(e, buttonId){
  if(buttonId==="newRoutine"){
    createWindow("New Routine","RoutineName.html");
    // mainWindow.webContents.send("dbName",db_name ,dir_prefix_name);
  }
  
  else if(buttonId=="oldRoutine"){
    createWindow("old Routine","oldRoutine.html");
    console.log("update old routine");
  }
  
  else if(buttonId == "editTeacher"){
    createWindow("Edit Teacher","editTeacher.html");
  }

  else if(buttonId=="editCourse"){
    createWindow("Edit Course","editSubject.html");
  }

  else if(buttonId == "addTeacher"){
    createWindow("Add Teacher","addTeacher.html");
  }

  else if(buttonId=="addCourse"){
    createWindow("Add Course","addSubject.html");
  }


  // else if(buttonId=="saveRoutine"){
  //   createWindow("Name of Routine", "databaseName.html");
  // }
});

//closing the window by "cancel" button.
ipcMain.on('closeWindow', function(e){
  addWindow.close();
});

ipcMain.on('print-to-pdf', event => {
  const pdfPath = path.join(pdf_path, 'DummyRoutine.pdf');
  console.log(pdfPath);
  const win = BrowserWindow.fromWebContents(event.sender);

  win.webContents.printToPDF({}, (error, data) => {
    if (error) return console.log(error.message);

    fs.writeFile(pdfPath, data, err => {
      if (err) return console.log(err.message);
      shell.openExternal('file://' + pdfPath);
      // event.sender.send('wrote-pdf', pdfPath);
    })
    
  })
});

// ipcMain.on('export-word', e => {

// })

