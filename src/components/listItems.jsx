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

function changePage(page){
    let path = page.toLowerCase();
    if(path === "speech api"){
        path="speech-api";
    }
    window.location = `http://localhost:3000/${path}`;
}

//<img className="fill-white h-[48%]" src={item.img} alt={item.text}/>

export default function ListItem() {

    return(

        <ul className="flex flex-row justify-between h-full w-full gap-6 items-center z-3">
            {items.map(item => { 
                return(
                    <li className="flex flex-col items-center py-1 justify-center w-[6vw] h-[85%] rounded-[100px] hover:bg-[#35363C] active:bg-[#35363C] z-3" onClick={()=>changePage(item.text)}>
                        <span className="text-[1vw] text-fuchsia-300">{item.text}</span>
                    </li>
            )})}
        </ul>

    )
}