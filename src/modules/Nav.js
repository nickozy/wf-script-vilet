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
            },
            mouseenter: {
              edu: 'openEdu',
              educlose: 'closeEdu', 
            },
            mouseleave:{
              educlose: 'closeEdu', 
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