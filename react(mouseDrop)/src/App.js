import Main from './components/main'
import { useEffect } from 'react'
import './css/main.css'


export default function App(){


    let mouseOverMainState = false;
    const mouseOverMain = function(){
        mouseOverMainState = true;
    };
    const MouseUpMain = function(){
        mouseOverMainState = false
    }
    window.addEventListener('mouseup',function(){
        MouseUpMain();
    })
    const throwCan = function(){
      const main = document.querySelector('.mainboxbox');
      main.style.transition = '.3s ease'
      main.style.opacity = '0.5'
      main.remove()
    }
    useEffect(function(){
      const can = document.querySelector('.can');
      can.style.width = '100px'
      can.style.aspectRatio = '1'
      can.style.border = '2px solid black'
      can.style.borderRadius = '50%'
      can.style.margin = '200px auto 0'

      const main = document.querySelector('.mainboxbox');
      let [poLeft, poTop] =[+main.offsetLeft, +main.offsetTop] 
      window.addEventListener('mousemove',function(event){
        if(main){
          if(mouseOverMainState){
              const mx = event.movementX;
              const my = event.movementY;
              poLeft += mx; poTop += my;
              if(main.offsetTop < 100){
                  const ih = window.innerHeight;
                  mouseOverMainState = false
                  main.style.transition = '.3s ease'
                  poTop = ih/2;
              }else{
                  main.style.transition = ''
              }
          }
          main.style.top = `${poTop}px`
          main.style.left = `${poLeft}px`
        }
      })
    })
    
  return(
    <div id="app">
      <div className="can"></div>
      <div className="mainboxbox" onMouseDown={mouseOverMain}>
        <Main />
      </div>
    </div>
  )
}