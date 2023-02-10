import React from 'react'

interface Props {
    text: string;
    iconSrc?: string;
    iconStyle?: string;
    customStyle?: string;
    type: "primary" | "secondary" | "custom";
}


const Button: React.FC<Props> = (props) => {
    const { customStyle } = props;
    const getButtonClass = (type: "primary" | "secondary" | "accent" | "custom") => {
        switch (type) {
            case "primary":
                return `w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800 bg-black ${customStyle}`
            case "secondary":
                return `w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800 ${customStyle}`
            case "custom":
                return `w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium shadow-sm align-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm ${customStyle}`
            default:
                return ""

        }
    }

    return (
        <button className={getButtonClass(props.type)}><img src={props.iconSrc} alt="icon" className={props.iconStyle} />{props.text}</button>
    )
}

export default Button