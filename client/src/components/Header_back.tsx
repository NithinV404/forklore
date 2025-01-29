import icon_back from "../assets/icon-back.svg";
import { useLocation, useNavigate } from "react-router-dom";
import header_back_style from "./Header_back.module.css";
import { useEffect } from "react";

export default function HeaderBack() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        navigate(location.state?.from || "/", {
            state: { scrollPosition: location.state?.scrollPosition }
        });
    }

    useEffect(() => {
        console.log(location.state?.scrollPosition);
        window.scrollTo(0, location.state?.scrollPosition || 0);
    }, [location.state?.scrollPosition]);

    return (
        <header className={header_back_style.header}>
            <div onClick={handleBack} className={header_back_style.circle}>
                <img
                    src={icon_back}
                    alt="back"
                    className={header_back_style.back_icon} />
            </div>
        </header>
    )
}