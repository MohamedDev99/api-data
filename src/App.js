import axios from "axios";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { previewDetailsState, showState } from "./Atom/PreviewAtom";
import Preview from "./components/Preview";
import Table from "./components/Table";

export default function App() {
    const previewDetails = useRecoilValue(previewDetailsState);
    const isShowing = useRecoilValue(showState);

    console.log(previewDetails);

    // * get data from api and cache it.
    // * if data changed, react-query will change the data for us
    const { isLoading, data } = useQuery("products", () =>
        axios
            .get("https://fakestoreapi.com/products")
            .then((res) => res.data)
            .catch((err) => console.log(err))
    );

    console.log(isLoading ? "loading" : data);

    if (isLoading) {
        return (
            <main className="bg-[#0F172A] h-screen text- flex items-center justify-center w-full">
                <img src="./img/loading.svg" alt="" />
            </main>
        );
    }

    return (
        <main className="relative bg-[#0F172A] h-screen text- flex flex-col items-center justify-center w-full overflow-y-scroll text-white">
            <section className="max-w-5xl h-screen">
                <h1 className="my-8 text-center font-montserrat text-3xl tracking-widest">
                    All Products
                </h1>
                <h2 className="w-full text-center text-orange-300 text-xl my-8 font-mali">
                    created by react library and styled by tailwindcss
                </h2>
                <Table products={data} />
            </section>
            {isShowing && <Preview />}
        </main>
    );
}
