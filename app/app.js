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
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  //mainWindow.loadURL('file://' + __dirname + '/index.html');
     mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
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


ipcMain.on('Database:add', function(e, item){
  console.log(item);
  mainWindow.webContents.send('DataBase:Create', item);
  addWindow.close();
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});



// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      {
        label:'Update Old Routine',
        accelerator:process.platform == 'darwin' ? 'Command+o' : 'Ctrl+o',
        click(){
          ipcMain.on('dir:open', function(e, db){
            console.log(db);
            mainWindow.webContents.send('dir:open', db);
            addWindow.close();
            // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
            //addWindow = null;
          });

          //shell.openItem('./databases')
          // fs.readFile(p, 'utf8', function (err, data) {
          // if (err) return console.log(err);
          // data is the contents of the text file we just read

          
        }
      },

      
      {
	      label:'Create New Routine',
	      accelerator:process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
	      click(){
		      createWindow("New Routine","databaseName.html");
	      }
      },

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



