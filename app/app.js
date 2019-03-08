const electron = require('electron');
const path = require('path');
const url = require('url');
const ipc= electron.ipcMain;
const ipc_r=require('electron').ipcRenderer;
//set Env
process.env.NODE_ENV = 'development';
const {app, BrowserWindow, Menu, ipcMain} = electron;
var fs = require('fs');
const {shell} = require('electron') // deconstructing assignment

db_name='dummydata.sqlite3';
let mainWindow;
let addWindow;
const dir_prefix_name = app.getAppPath();

var db_Path= dir_prefix_name + '/databases/' + db_name ;
// console.log(dir_prefix_name);
// var sqlite3 = require('sqlite3').verbose();

// var db =  new sqlite3.Database(db_Path);
// global.sharedObj = {prop1 :  db_Path};
var db;

app.on('window-all-closed', function() {
  app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

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

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
  // mainWindow.webContents.send("dbName",db_name ,dir_prefix_name);

});

// Handle add item window
function createWindow(TITLE,HTML_FILE){
  addWindow = new BrowserWindow({
    show:false,
    width: 400,
    height:300,
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


// ipcMain.on('Database:add', function(e, db_name){
//   console.log(db_name);
//   mainWindow.webContents.send('DataBase:Create', db_name, dir_prefix_name);
//   addWindow.close();
//   // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
//   //addWindow = null;
// });


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


// ipcMain.on('Database:old', function(e, db_name){
//   console.log(db_name);
//   mainWindow.webContents.send('DataBase:append', db_name, dir_prefix_name);
//   addWindow.close();
//   // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
//   //addWindow = null;
// });


//EDIT FROM PRASHANT
//Below are the functions to listen to button clicks in Main Menu.
//Each button click sends a message "button clicked" and the Id of the button clicked.
//some clicks might not have functionality.

ipcMain.on('buttonClicked', function(e, buttonId){
  // if(buttonId==="newRoutine"){
  //   createWindow("New Routine","databaseName.html");
  // }

  if(buttonId==="newRoutine"){
    createWindow("New Routine","RoutineName.html");
    // mainWindow.webContents.send("dbName",db_name ,dir_prefix_name);
  }
  
  else if(buttonId=="oldRoutine"){
    createWindow("old Routine","oldRoutine.html");
    console.log("update old routine");
  }

  // else if(buttonId=="oldRoutine"){
  //   createWindow("old Routine","oldDb.html");
  //   console.log("update old routine");
  // }
  
  else if(buttonId == "addTeacher"){
    createWindow("Add Teacher","addTeacher.html");
  }

  else if(buttonId=="addCourse"){
    createWindow("Add Course","addSubject.html");
  }


});




// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      // {
      //   label:'Update Old Routine',
      //   accelerator:process.platform == 'darwin' ? 'Command+o' : 'Ctrl+o',
      //   click(){

      //     const { dialog } = require('electron');
      //     var db_dir = dir_prefix_name + '/databases/';
      //     old_db = dialog.showOpenDialog([BrowserWindow],{focus : [true]} ,{defaultPath : [db_dir]} ,{filters: [{name: 'databases', extensions: ['sqlite3'] }]} ,{ properties: ['openFile'] });
      //     mainWindow.webContents.send('open:Db', String(old_db));
      //     // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
 
      //   }
      // },

      {
        label:'Update Old Routine',
        accelerator:process.platform == 'darwin' ? 'Command+o' : 'Ctrl+o',
        click(){

          // const { dialog } = require('electron');
          // var db_dir = dir_prefix_name + '/databases/';
          // old_db = dialog.showOpenDialog([BrowserWindow],{focus : [true]} ,{defaultPath : [db_dir]} ,{filters: [{name: 'databases', extensions: ['sqlite3'] }]} ,{ properties: ['openFile'] });
          // mainWindow.webContents.send('open:Db', String(old_db));
          // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
 
          createWindow("New Routine","oldRoutine.html");

        }
      },

      {
	      label:'Create New Routine',
	      accelerator:process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
	      click(){
		      createWindow("New Routine","RoutineName.html");
	      }
      },

      // {
	    //   label:'Create New Routine',
	    //   accelerator:process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
	    //   click(){
		  //     createWindow("New Routine","databaseName.html");
	    //   }
      // },

      {
        label:'Print',
        accelerator:process.platform == 'darwin' ? 'Command+P' : 'Ctrl+P',
        click(){
         // createAddWindow();
                print_page();
        }
      },
      {
        //label:'Clear Items',
        label:'Save',
        accelerator:process.platform == 'darwin' ? 'Command+s' : 'Ctrl+s',
        click(){
         // mainWindow.webContents.send('item:clear');

        }
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Instructor',
	  submenu:[
		 {
		  	label:'Add Teacher',
			  click(){
				  createWindow("ADD TEACHER","addTeacher.html");
			  }
      },
      
      {
		  	label:'Delete Teacher',
			  click(){
				  createWindow("DELETE TEACHER","deleteTeacher.html");
			  }
		  }
	  ]
  },

  {
    label:'Subject',
	  submenu:[
      {
        label:'Add Subject',
        click(){
          createWindow("ADD SUBJECT","addSubject.html");
        }
      }
    ]

  },

  {
    label: 'About',
  }
];

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
