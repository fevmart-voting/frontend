'use client';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ToastContext = () =>{
    return (
        <div>
            <ToastContainer limit={4}/>
        </div>
    );
};