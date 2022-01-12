import { atom } from "recoil";

// ? for show Preview state ( get / update )
export const showState = atom({
    key: "showState",
    default: false,
});

// * get details for show them in Preview Component
export const previewDetailsState = atom({
    key: "previewDetails",
    default: null,
});
