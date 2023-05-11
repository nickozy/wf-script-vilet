import { module } from 'modujs';

const nav = document.body;

export default class extends module {
    constructor(m) {
        super(m);
        this.events = {
            click: {
              open: 'openNav',
              close: 'closeNav',
              toggle: 'closeNav',
              maptoggle: "toggleMap"
            },
            mouseenter: {
              edu: 'openEdu',
              educlose: 'closeEdu', 
            },
            mouseleave:{
              eduleave: 'closeEdu', 
            }
          }
    }

    openNav(){
        if (nav.classList.contains('menu-open')) {
            nav.classList.remove('menu-open');
          } else {
            nav.classList.add('menu-open');
          }
    }
   
    toggleMap(){
      
      if (nav.classList.contains('map-show')) {
          nav.classList.remove('map-show');
        } else {
          nav.classList.add('map-show');
        }
  }
    
    closeNav(){
        nav.classList.remove("menu-open")
    }
    closeNav(){
        nav.classList.toggle("menu-open")
    }

      openEdu(){
        nav.classList.add('menu-open--edu');
    }
    closeEdu(){
      nav.classList.remove('menu-open--edu');
    }
}