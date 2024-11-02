import {ReactNode} from "react";
import {useRecoilValue} from "recoil";
import {isAuthorizedState} from "../Recoil/RecoilState.ts";

interface Props {
    children: ReactNode
}
export const UnAuthorized = (
    {
        children
    }:Props
) => {
    const isAuthorized = useRecoilValue(isAuthorizedState)
    return <>
        {!isAuthorized && children}
    </>
}