import ListItems from "./listItems";
export default function Header(){

    return(
        <>
            <div className="bg-[#04041A] h-[7vh] w-[fit-content] text-nowrap justify-center rounded-full my-5 text-white text-md items-center px-5 xl:flex hidden z-3">                
                    <ListItems/>
            </div>
            <h1 className="xl:hidden flex">Dziala</h1>
           
            <div className="absolute top-[1vw] left-[0vw] z-0">
            <div className="w-[19vw] h-[19vw] rounded-full bg-[#9773E2] opacity-[45%] blur-[6vw] z-0"></div>
            </div>
            <div className="absolute top-[35vw] left-[85vw] z-0">
            <div className="w-[10vw] h-[10vw] rounded-full bg-[#6D8565] opacity-[58%] blur-[5vw] z-0"></div>
            </div>
            <div className="absolute top-[8vw] right-[  5vw] z-0">
            <div className="w-[19vw] h-[19vw] rounded-full bg-[#52616A] opacity-[50%] blur-[5.5vw] z-0"></div>
            </div>

            
        </>
    );

}