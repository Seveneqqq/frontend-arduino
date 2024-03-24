import {useState} from 'react';

export default function Navbar(){

    let [isMobile, screenChange] = useState("false");


    function checkSize() {
       let size = window.innerWidth;
      
       
       if(size<=1024){
        screenChange(true);
       }
       else{
        screenChange(false);
       }
       
    }

    window.addEventListener('resize', checkSize);
    window.addEventListener('load', checkSize);
    

    if(isMobile){
        return(
            <h1>dsad</h1>
        );
    }
    else{
        return(
        <ul className="flex lg:flex-row lg:gap-20">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li className="hover:cursor-pointer">Login</li>
                </ul>
        );
    }


}