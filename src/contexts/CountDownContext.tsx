import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
    startBreakTime: () => void;
    finishBreakTime: () => void;

}

interface CountdownProviderProps{
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData)
let countdownTimeout: NodeJS.Timeout;

export function CountdownProvider( { children}: CountdownProviderProps) {
    
    const { startNewChallenge }  = useContext(ChallengesContext);

    const [time, setTime] = useState(0.2 * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    function startCountdown() {
        setIsActive(true);
    }

    function startBreakTime() {
        setIsActive(true);
        setTime(10 * 60);
    }
    function finishBreakTime() {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setHasFinished(false);
        setTime(50 * 60);
    }

    function resetCountdown() {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setTime(50 * 60);
    }

    useEffect(() => {
        if (isActive && time > 0) {
            countdownTimeout= setTimeout(() => {
                setTime(time -1);
            }, 1000)
        } else if (isActive && time === 0) {
            console.log("Finish")
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
            startBreakTime();
        }
    }, [isActive, time])

    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown,
            startBreakTime,
            finishBreakTime,

        }}>
            {children}
        </CountdownContext.Provider>
    )
}