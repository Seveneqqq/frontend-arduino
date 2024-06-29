import "../styles/circularPanelStyle.css";

import lightning from "../icons/lightning.svg";
import web from "../icons/web.svg";
import temperature from "../icons/temperature.svg";
import notifications from "../icons/notifications.svg";
import settings from "../icons/settings.svg";
import voice from "../icons/voice.svg";
import alerts from "../icons/alerts.svg";
import lock from "../icons/lock.svg";
import monitoring from "../icons/monitoring.svg";

export default function CircularInfoPanel(){

    return(
        <>
            <div className="circle" style={{ '--total': 9 }}>
            <div className="stat" style={{ '--i': 1 }}>
                
                    <img src={lock} alt="info" className="h-[50%]"/>
                    <span className="text-white text-xs">Security</span>
            
            </div>
            <div className="stat" style={{ '--i': 2 }}>

                <img src={monitoring} alt="info" className=" h-[50%]"/>
                <span className="text-white text-xs">Monitoring</span>

            </div>
            <div className="stat" style={{ '--i': 3 }}>

                <img src={web} alt="info" className=" h-[50%]"/>
                <span className="text-white text-xs">Online system</span>

            </div>
            <div className="stat" style={{ '--i': 4 }}>

                <img src={voice} alt="info" className="h-[50%]"/>
                <span className="text-white text-xs">Voice <br/> recognition</span>

            </div>
            <div className="stat" style={{ '--i': 5 }}>

                <img src={alerts} alt="info" className=" h-[50%]"/>
                <span className="text-white text-xs">Logs & Alerts</span>

            </div>
            <div className="stat" style={{ '--i': 6 }}>

                <img src={settings} alt="info" className=" h-[50%]"/>
                <span className="text-white text-xs">Customization</span>

            </div>
            <div className="stat" style={{ '--i': 7 }}>

                <img src={notifications} alt="info" className=" h-[50%]"/>
                <span className="text-white text-xs">Notifications</span>

            </div>
            <div className="stat" style={{ '--i': 8 }}>

                <img src={temperature} alt="info" className=" h-[50%]"/>
                <span className="text-white text-xs">Sensors</span>

            </div>
            <div className="stat" style={{ '--i': 9 }}>

                <img src={lightning} alt="info" className=" h-[50%]"/>
                <span className="text-white text-xs">Lightning</span>

            </div>
            </div>
        </>
    );
}