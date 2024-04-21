import author from "../icons/author.svg";
import code from "../icons/code.svg";
import database from "../icons/database.svg";
import home from "../icons/home.svg";
import login from "../icons/login.svg";
import mic from "../icons/mic.svg";


const items = [
    {
        text: "Home",
        img: home,
    },
    {
        text: "Author",
        img: author,
    },
    {
        text: "Speech Api",
        img: mic,
    },
    {
        text: "Stack",
        img: code,
    },
    {
        text: "Database",
        img: database,
    },
    {
        text: "Login",
        img: login,
    }
];

function test(x){
    let path = x.toLowerCase();
    window.location = `http://localhost:3000/${path}`;
}


export default function ListItem() {

    return(

        <ul className="flex flex-row justify-between h-full w-full items-center z-3">
            {items.map(item =>{ 
                return(
                    <li className="flex flex-col items-center justify-center w-full h-[85%] rounded-full hover:bg-[#35363C] active:bg-[#35363C] z-3" onClick={()=>test(item.text)}>
                        <img className="fill-white h-[48%]" src={item.img} alt={item.text}/>
                        <span className="text-md">{item.text}</span>
                    </li>
            )})}
        </ul>

    )
}