

import menu from "./mainMenu.json" with { type : 'json'}


let menuItems = [];
menu.forEach((item)=>{
  menuItems.push(item)
})

export default menuItems;




