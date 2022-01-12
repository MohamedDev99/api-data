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
                    Products Table
                </h1>
                <Table products={data} />
                <h2 className="w-full text-center text-orange-300 text-lg my-8 font-mali">
                    ** Libraries used in this app **
                </h2>
                <h4 className=" flex flex-col space-y-3 text-gray-400 text-xs text-center">
                    <span>1 - react library</span>
                    <span>2 - tailwindcss for styling</span>
                    <span> 3 - react-query for handling the api</span>
                    <span>4 - react-table for handling the table</span>
                </h4>
            </section>
            {isShowing && <Preview />}
        </main>
    );
}
