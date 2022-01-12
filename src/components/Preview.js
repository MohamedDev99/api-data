import { useRecoilState, useRecoilValue } from "recoil";
import { previewDetailsState, showState } from "../Atom/PreviewAtom";

export default function Preview() {
    // *  get image and description of product
    const { image, desc, price, title, rate } = useRecoilValue(previewDetailsState);
    console.log(image, desc);

    // * get and set state of preview component
    const [isShow, setIsShow] = useRecoilState(showState);

    console.log(isShow);

    return (
        <section
            onClick={() => setIsShow(false)}
            className="fixed bg-black/90 top-0 left-0 bottom-0 right-0 flex items-center justify-center">
            <div className="max-w-xl max-h-[70vh] bg-white/30 rounded py-2">
                <div className="p4 space-y-4  font-mali">
                    <img src={image} className="w-full max-h-56 rounded-t object-contain" alt="" />
                    <h3 className="text-center">{title}</h3>
                    <div className="flex items-center justify-around px-4">
                        <span>{price}$</span>
                        <span>{"⭐ " + rate}</span>
                    </div>
                    <p className="text-orange-400 tracking-widest text-center p-4">{desc}</p>
                </div>
            </div>
        </section>
    );
}
