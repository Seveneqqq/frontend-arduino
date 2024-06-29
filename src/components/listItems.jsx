import author from "../icons/author.svg";
import code from "../icons/code.svg";
import database from "../icons/database.svg";
import home from "../icons/home.svg";
import login from "../icons/login.svg";
import mic from "../icons/mic.svg";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


const items = [
    {
        text: "Home",
        img: home,
        path: "/home"
    },
    {
        text: "Author",
        img: author,
        path: "/author"
    },
    {
        text: "Speech Api",
        img: mic,
        path: "/speech-api"
    },
    {
        text: "Stack",
        img: code,
        path: "/stack"
    },
    {
        text: "Database",
        img: database,
        path: "/database"
    },
    {
        text: "Login",
        img: login,
        path: "/login"
    }
];

//<img className="fill-white h-[48%]" src={item.img} alt={item.text}/>


export default function ListItem() {

    return (
        <ul className="flex flex-row justify-between h-full w-full gap-6 items-center z-3">
            {items.map(item => {
                return (
                    <Link to={item.path} className="flex flex-col items-center text-[1vw] text-fuchsia-300 py-1 justify-center w-[6vw] h-[85%] rounded-[100px] hover:bg-[#35363C] active:bg-[#35363C] z-3">   
                        <li key={item.path}>
                            {item.text} 
                        </li>
                    </Link>
                );
            })}
        </ul>
    );
}