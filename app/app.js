const electron = require('electron');
const path = require('path');
const url = require('url');
process.env.NODE_ENV = 'development';
const {app, BrowserWindow, Menu, ipcMain} = electron;
const fs = require('fs');
const os = require('os');
const {shell} = require('electron') // deconstructing assignment
const dir_prefix_name = app.getAppPath();
const pdf_path = dir_prefix_name + "/pdf_dir/";
const word_path = dir_prefix_name + "/word_dir/";
let db='';
let mainWindow;
let addWindow;
let Table_name = "";


app.on('window-all-closed', function() {
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1000, height: 720});
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
  return addWindow;
}


// Catch item:add
ipcMain.on('Teacher:add', function(e, teacher_name, teacher_initials){
  mainWindow.webContents.send('Teacher:Store',teacher_name, teacher_initials);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});

ipcMain.on('Supervisor:add', function(e, Supervisor_name, Supervisor_initials, Supervisor_position){
  // console.log(Supervisor_name);
  // console.log(Supervisor_initials);
  // console.log(Supervisor_position);
  mainWindow.webContents.send('Supervisor:Store',Supervisor_name, Supervisor_initials,Supervisor_position);
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

ipcMain.on('Routine:add', function(e, Routine_name, batch_yr, prog_full, prog_acr, year_rot, yr_part){
  Table_name = Routine_name;
  console.log(Table_name);    
  mainWindow.webContents.send('Routine:Create', Table_name,batch_yr, prog_full, prog_acr, year_rot, yr_part);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});


ipcMain.on('Routine:old', function(e, Routine_name){
  Table_name = Routine_name;
  console.log(Table_name);
  mainWindow.webContents.send('Routine:append', Table_name);
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
  else if(buttonId=="addSupervisor"){
    createWindow("Add Course","addSupervisor.html");
  }
  else if(buttonId=="editSupervisor"){
    createWindow("Add Course","Edit_supervisor.html");
  }


  // else if(buttonId=="saveRoutine"){
  //   createWindow("Name of Routine", "databaseName.html");
  // }
});


// pdf print function
//closing the window by "cancel" button.
ipcMain.on('closeWindow', function(e){
  addWindow.close();
});

ipcMain.on('return_menu', function(e){
  mainWindow.loadURL('file://' + __dirname + '/menu.html');

});

ipcMain.on('hideWindow', function(e){
  addWindow.hide();
});

// ipcMain.on('print-to-pdf', function(event, table_name){
//   table_name_ext = table_name + '.pdf'
//   const pdfPath = path.join(pdf_path, table_name_ext);
//   console.log(pdfPath);
//   const win = BrowserWindow.fromWebContents(event.sender);

//   win.webContents.printToPDF({}, (error, data) => {
//     if (error) return console.log(error.message);

//     fs.writeFile(pdfPath, data, err => {
//       if (err) return console.log(err.message);
//       shell.openExternal('file://' + pdfPath);
//       event.sender.send('wrote-pdf', pdfPath);
//     })
    
//   })
// });

// Receiving communication from index.html for new window creation and passing table_name info to main process..ie..app.js

ipcMain.on('print-to-Word', function(event, table_name) {
      Table_name = table_name;
      secondWindow = createWindow("Word","printable.html");  
});

//receiving communication from printable.html for quering Routine_name information

ipcMain.on('print-to-Word2',function(e){
  console.log("yaay");
  console.log(Table_name);
  secondWindow.webContents.send('doc_name', Table_name);
});
